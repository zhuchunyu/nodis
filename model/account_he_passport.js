module.exports = {
  properties: {
    id: {
      type: 'string'
    },
    account_id: {
      type: 'string'
    },
    role: {
      type: 'number'
    },
    name: {
      type: 'string'
    },
    nick_name: {
      type: 'string'
    },
    email: {
      type: 'string'
    },
    avator: {
      $ref: 'schema.definition#/oid'
    },
    enterprise: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          enum: ['MALE', 'FEMALE']
        },
        birthday: {
          type: 'string'
        },
        mobile_model: {
          type: 'string'
        }
      },
      $async: true,
      additionalProperties: false
    }
  },
  $async: true,
  additionalProperties: false
}
