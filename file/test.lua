log.info('test mongo...')

local config = {
    pool_id = 'hewu_auth',
    host = '172.19.3.186',
    port = 26007,
    database = 'hewu',
    w_mode = 'safe'
}

mongodb.ensure_pool(config)

log.info('mongo ok!')

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

local doc = mongodb.find_one('hewu_auth', 'names', { name = 'test' })
log.info(to_string(doc))
if doc then

    log.info(id_to_hex(doc._id))

    for k, v in pairs(doc.auths) do
        log.info(doc.auths[k])
    end
end

log.info('cursor')

local cursor = mongodb.find('hewu_auth', 'nexts', {})
log.info('cursor ok')
local nexts = mongodb.take(cursor, 5)

log.info(type(nexts))
log.info(to_string(table_len(nexts)))

for k, v in pairs(nexts) do
    log.info(to_string(v))
end

mongodb.close(cursor)

log.info('mongo end!')
