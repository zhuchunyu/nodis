# SaaS 平台 MQTT 通信协议

## 更新日志

| 时间        | 修订者  | 修订说明                               |
| --------- | ---- | ---------------------------------- |
| 2018.3.30 | 马姣   | H5 应用 MQTT 协议制定                    |
| 2018.4.11 | 谢国东  | MQTT 协议重新制定，修改所有 Topic 及相关 Payload |



## 1. 数据格式

数据采用 TLV 的格式封装

| 名称     | 长度   | 字节序  | 备注                 |
| ------ | ---- | ---- | ------------------ |
| Type   | 1字节  | N/A  | 类型对应的索引值           |
| Length | 2字节  | 小端   | 数据长度，最大可表示65535个字节 |
| Value  | N字节  | 小端   | 数据内容               |

根据 T 表示的 `索引值` 不同，V 表示的数据类型也有所差异

|           | 索引值  | 占用字节数 (Byte) |            说明             |
| --------- | :--: | :----------: | :-----------------------: |
| Boolean   |  1   |      1       | 0x00 = false, 0x01 = true |
| Enum      |  2   |      1       | 每一个值表示一个对应的枚举值（0x00-0xFF） |
| Integer   |  3   |      4       |                           |
| Float     |  4   |      8       |                           |
| Buffer    |  5   |    <= 255    |                           |
| Exception |  6   |      8       |     每一位标识一个故障，最多表示64个     |
| String    |  7   |    <= 255    |         UTF-8 编码          |

#### 消息类型

type 由4个字节构成，前2个字节表示消息级别，后两个字节表示具体分类。

| 消息级别           | 分类                       | 值                       |
| -------------- | ------------------------ | ----------------------- |
| 系统 (0x0001)    | 绑定(0x0001)               | 0x00010001              |
| 系统 (0x0001)    | 解绑(0x0002)               | 0x00010002              |
| 设备 (0x0002)    | 设备信息(0x0001)             | 0x00020001              |
| 设备 (0x0002)    | 上线(0x0002)               | 0x00020002              |
| 设备 (0x0002)    | 下线(0x0003)               | 0x00020003              |
| 设备 (0x0002)    | Token 请求(0x0004)         | 0x00020004              |
| 设备 (0x0002)    | Token 响应(0x0005)         | 0x00020005              |
| 功能点上报 (0x0003) | 功能点顺序值 (0x0001 - 0xffff) | 0x00030001 - 0x0003ffff |
| 功能点下发 (0x0004) | 功能点顺序值 (0x0001 - 0xffff) | 0x00040001 - 0x0004ffff |


## 2. SaaS MQTT 连接建立

#### 测试服务器地址 

> TCP: 172.19.3.186:26003
>
> WS: 172.19.3.186:26008/mqtt
>
> WSS: 172.19.3.186:26009/mqtt

#### Payload

**对于设备**

| 有效荷载              | Type   | Length | Value         | 说明                              |
| ----------------- | ------ | ------ | ------------- | ------------------------------- |
| Client Identifier | String | *      | 设备 SN         |                                 |
| Username          | String | *      | Connection ID | APP 通过 connection 接口创建 或者二维码中提供 |
| Password          | String | *      | Binding-Token |                                 |

**对于APP **

| 有效荷载              | Type   | Length | Value         |
| ----------------- | ------ | ------ | ------------- |
| Client Identifier | String | *      | 用户 ID         |
| Username          | String | *      | Connection ID |
| Password          | String | *      | Accesss-Token |

**对于H5 应用**

| 有效荷载              | Type   | Length | Value         |
| ----------------- | ------ | ------ | ------------- |
| Client Identifier | String | *      | UUID  （客户端生成） |
| Username          | String | *      | USER-ID       |
| Password          | String | *      | Accesss-Token |


## 3. PaaS Topics

### $sys/:product_id/:device_sn/sqdata `Device` `Publish`

**描述**: 用于设备上报数据

**Payload**:

`*byte 表示非SAAS平台通用TLV格式类型，而是原始二进制类型`

| 序列   | Type    | Length | Value              | 说明           |
| ---- | ------- | ------ | ------------------ | ------------ |
| 1    | *byte   | 1      | 0x02               | 设备信息         |
| 2    | *byte   | 2      | 序列3数据长度            | 高字节在前        |
| 3    | *byte   | *      | {”ds_id”:”${功能点}”} | 内容为 JSON 格式  |
| 4    | *byte   | 4      | 后续数据长度             | 高字节在前        |
| 5    | Integer | 4      | 消息 Type            | 该消息类型，可用值见下表 |
| 6    | *       | *      | 消息体                | 结构根据 Type 变化 |

#### Types 及对应的 Payload
**meta**: 设备信息上报消息

| 序列   | Type    | Length | Value          | 说明   |
| ---- | ------- | ------ | -------------- | ---- |
| 5    | Integer | 4      | 0x00020001     | 设备信息 |
| 6    | String  | *      | MCU 固件版本       |      |
| 7    | String  | *      | WIFI 模块型号      |      |
| 8    | String  | *      | WIFI 模块 MAC 地址 |      |
| 9    | String  | *      | WIFI 模块固件版本    |      |

**online**: 设备上线消息。

| 序列   | Type    | Length | Value      | 说明   |
| ---- | ------- | ------ | ---------- | ---- |
| 5    | Integer | 4      | 0x00020002 | 上线消息 |

**will**: 设备离线消息, 该 type 非设备直接 publish , 而是在连接服务器时通过遗嘱消息设置。

| 序列   | Type    | Length | Value      | 说明   |
| ---- | ------- | ------ | ---------- | ---- |
| 5    | Integer | 4      | 0x00020003 | 遗嘱消息 |

**status**: 设备状态上报消息

| 序列   | Type    | Length | Value      | 说明   |
| ---- | ------- | ------ | ---------- | ---- |
| 5    | Integer | 4      | 0x0003xxxx | 设备状态 |
| 6    | *       | *      | 功能点值       |      |


### $sys/:product_id/:device_sn/creq/:command_id `Device` `Subscribe`

| 序列   | Type    | Length | Value   | 说明           |
| ---- | ------- | ------ | ------- | ------------ |
| 1    | Integer | 4      | 命令 Type | 该命令类型，可用值见下表 |
| 2    | *       | *      | 命令体     | 结构根据 Type 变化 |

#### Types 及对应的 Payload

**system**: 设备绑定

| 序列   | Type    | Length | Value      | 说明   |
| ---- | ------- | ------ | ---------- | ---- |
| 1    | Integer | 4      | 0x00010001 | 系统命令 |

**system**: 设备解绑

| 序列   | Type    | Length | Value      | 说明   |
| ---- | ------- | ------ | ---------- | ---- |
| 1    | Integer | 4      | 0x00010002 | 系统命令 |

**function**: 功能点下发   ok

| 序列   | Type    | Length | Value      | 说明   |
| ---- | ------- | ------ | ---------- | ---- |
| 1    | Integer | 4      | 0x0004xxxx | 功能点  |
| 3    | *       | *      | 功能点取值      |      |

### $sys/:product_id/:device_sn/crsp/:command_id `Device` `Publish`

| 序列   | Type    | Length | Value  | 说明   |
| ---- | ------- | ------ | ------ | ---- |
| 1    | Boolean | *      | 命令执行状态 |      |

## 4. SaaS Topics

#### `client/connections/:connection_id/devices` `APP` `Subscribe`

**描述**:  用于 APP 监听连接设备列表, 数据为 JSON 格式

**Payload**: 

| 属性                | 值      | 说明    |
| ----------------- | ------ | ----- |
| device.product_id | String | 产品 ID |
| device.device_id  | String | 设备 ID |

**example**:
```
[
	{"product_id": ${product_id}, "device_id": ${device_id}},
	{"product_id": ${product_id}, "device_id": ${device_id}}
]
```


#### `device/products/:product_id/devices/:device_sn/command` `Device` `Publish`

**描述**: 用于设备向 SAAS 请求 TOKEN, 数据为 TLV 格式

**Payload**:

| 序列   | Type    | Length | Value         | 说明   |
| ---- | ------- | ------ | ------------- | ---- |
| 1    | Integer | 4      | 0x00020004    | 命令类型 |
| 2    | String  | *      | Connection ID |      |

#### `device/products/:product_id/devices/:device_sn/command_resp` `Device` `Subscribe`

**描述**: 用于 SAAS 向设备返回 TOKEN, 数据为 TLV 格式

| 序列   | Type    | Length | Value      |                        |
| ---- | ------- | ------ | ---------- | ---------------------- |
| 1    | Integer | 4      | 0x00020005 | 命令类型                   |
| 2    | String  | *      | PaaS Token | 连接 OneNET MQTT 的 TOKEN |

#### `client/products/:product_id/devices/:device_sn/status` `Client` `Subscribe`

**描述**: 用于 client 监听设备状态, 数据为 JSON 格式

| 属性       | 值        | 说明              |
| -------- | -------- | --------------- |
| function | *Integer | 0x0001 - 0xffff |
| value    | *        | 功能点值            |

#### `client/products/:product_id/devices/:device_sn/command` `Client` `Publish`

**描述**: 用于 client 下发命令, 数据为 JSON 格式

| 属性       | 值        | 说明              |
| -------- | -------- | --------------- |
| task_id  | *UUID    | 任务 ID           |
| function | *Integer | 0x0001 - 0xffff |
| type     | *        | 功能点类型           |
| value    | *        | 功能点值            |

#### `client/products/:product_id/devices/:device_sn/command_resp` `Client` `Subscribe`  ok



**描述**: 用于 client 接受设备反馈, 数据为 JSON 格式

| 属性      | 值        | 说明    |
| ------- | -------- | ----- |
| task_id | *UUID    | 任务 ID |
| result  | *Boolean | 任务反馈  |

#### `client/products/:product_id/devices/:device_sn/connection` `Client` `Subscribe`

**描述**: 用于 client 监听设备上下线, 数据为 JSON 格式

| 属性     | 值        | 说明      |
| ------ | -------- | ------- |
| status | *Boolean | 在线 \ 离线 |

#### `server/products/:product_id/devices/:device_sn/exception` `Client` `Subscribe`  

**描述**: 用于 SaaS 平台通知异常, 数据为 JSON 格式

| 属性      | 值       | 说明                                       |
| ------- | ------- | ---------------------------------------- |
| type    | *Enum   | 错误类型 `['ClientError','ServerError','DeviceError']` |
| message | *String | 错误信息                                     |
| topic   | String  | 相关 Topic                                 |



