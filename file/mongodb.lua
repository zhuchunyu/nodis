require "auth/auth_commons"

pool = "auth_mongodb"

local auth_collection = 'auth_users'

config = {
    pool_id = pool
}

function console_log( ... )
    local args = { ... }

    local arg_list = {}
    for k, v in pairs(args) do
        arg_list[k] = to_string(v)
    end

    log.info(table.concat(arg_list, ' '))
end

function table_keys(t)
    if type(t) ~= "table" then
        return false
    end

    local keys = {}
    for k, v in pairs(t) do
        table.insert(keys, k)
    end

    return keys
end

function table_len(t)
    if type(t) ~= "table" then
        return false
    end

    local length = 0
    for k, v in next, t, nil do
        length = length + 1
    end

    return length
end

function val_copy(val)
    if type(val) == "table" then
        local copy = {}
        for tbl_key, tbl_value in next, val, nil do
            copy[tbl_key] = tbl_value
        end
        return copy
    else
        return val
    end
end

function to_string(val)
    if type(val) == 'string' then
        return val
    elseif type(val) == 'nil' then
        return 'nil'
    elseif type(val) == 'boolean' then
        if val then
            return 'true'
        else
            return 'false'
        end
    elseif type(val) == 'number' then
        if math.floor(val) < val then
            return string.format('%g', val)
        else
            return string.format('%d', val)
        end
    elseif type(val) == 'table' then
        if (val._id) then
            val = val_copy(val)
            val._id = id_to_hex(val._id)
        end

        return json.encode(val)
    else
        return type(val)
    end
end

function id_to_hex(vmq_objid)
    local hex_list = {}
    local id = string.sub(vmq_objid, 10, -1)
    for i = 1, string.len(id) do
        hex_list[i] = string.format('%x', string.byte(id, i))
    end

    return table.concat(hex_list)
end

function vmq_pattern_test(s, pattern)
    local lua_pattern = '^' .. string.gsub(pattern, '+', '[%a%d]+') .. '$'

    local pos = string.find(s, lua_pattern)
    return pos > 0
end

function in_topics(topic, topics)
    for i, acl in pairs(topics) do
        if vmq_pattern_test(topic, acl.pattern) then
            return true
        end
    end

    return false
end

function expired_table(expired_at)
    local expired = {}
    expired['$gt'] = os.time()*1000

    return expired
end

-- the function that implements the auth_on_register/5 hook
-- the reg object contains everything required to authenticate a client
--      reg.addr: IP Address e.g. "192.168.123.123"
--      reg.port: Port e.g. 12345
--      reg.mountpoint: Mountpoint e.g. ""
--      reg.username: UserName e.g. "test-user"
--      reg.password: Password e.g. "test-password"
--      reg.client_id: ClientId e.g. "test-id"
--      reg.clean_session: CleanSession Flag true
function my_auth_on_register(reg)
    console_log('auth-register:', reg)

    if (not reg.client_id) or (not reg.username) or (not reg.password) then
        return false
    end

    local auth_para = { username = reg.username, password = reg.password, expired_at = expired_table() }

    if string.len(reg.username) ~= 4 then
        auth_para.client_id = reg.client_id
    end

    local auth = mongodb.find_one(pool, auth_collection, auth_para)
    if not auth then
        return false
    end

    if os.time()*1000 >= auth.expired_at then
        return false
    end

    return true
end

-- the function that implements the auth_on_publish/6 hook
-- the pub object contains everything required to authorize a publish request
--      pub.mountpoint: Mountpoint e.g. ""
--      pub.client_id: ClientId e.g. "test-id"
--      pub.topic: Publish Topic e.g. "test/topic"
--      pub.qos: Publish QoS e.g. 1
--      pub.payload: Payload e.g. "hello world"
--      pub.retain: Retain flag e.g. false
function my_auth_on_publish(pub)
    console_log('auth-publish:', pub)

    if not pub.username then
        return false
    end

    local auth = mongodb.find_one(pool, auth_collection, { username = pub.username, expired_at = expired_table() })
    if not auth then
        return false
    end

    if os.time()*1000 >= auth.expired_at then
        return false
    end

    return in_topics(pub.topic, auth.subscribe_acl)
end

-- the function that implements the auth_on_subscribe/3 hook
-- the sub object contains everything required to authorize a subscribe request
--      sub.mountpoint: Mountpoint e.g. ""
--      sub.client_id: ClientId e.g. "test-id"
--      sub.topics: A list of Topic/QoS Pairs e.g. { {"topic/1", 0}, {"topic/2, 1} }
function my_auth_on_subscribe(sub)
    console_log('auth-subscribe:', sub)

    if  not sub.username then
        return false
    end

    local auth = mongodb.find_one(pool, auth_collection, { username = sub.username, expired_at = expired_table() })
    if not auth then
        return false
    end

    if os.time()*1000 >= auth.expired_at then
        return false
    end

    for k, topic in pairs(sub.topics) do
        if not in_topics(topic[1], auth.subscribe_acl) then
            return false
        end
    end

    return true
end

mongodb.ensure_pool(config)
console_log('mongodb connected ok!')

hooks = {
    auth_on_register = my_auth_on_register,
    auth_on_publish = my_auth_on_publish,
    auth_on_subscribe = my_auth_on_subscribe,
    on_unsubscribe = on_unsubscribe,
    on_client_gone = on_client_gone,
    on_client_offline = on_client_offline
}
