module.exports = {
  properties: {
    id: {
      type: 'string'
    },
    account_id: {
      type: 'string'
    },
    password: {
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
    secret: {
      type: 'string'
    },
    enterprise: {
      type: 'object',
      properties: {
        name: {
          type: 'string'
        },
        corporation: {
          type: 'string'
        },
        industry: {
          type: 'string'
        },
        logo: {
          $ref: 'schema.definition#/oid'
        },
        introduce: {
          type: 'string'
        },
        license: {
          type: 'array',
          items: { $ref: 'schema.definition#/oid' }
        },
        location: {
          type: 'object',
          properties: {
            province: {
              type: 'string'
            },
            city: {
              type: 'string'
            },
            distinct: {
              type: 'string'
            },
            addr: {
              type: 'string'
            }
          }
        },
        contact: {
          type: 'object',
          properties: {
            name: {
              type: 'string'
            },
            department: {
              type: 'string'
            },
            tel: {
              type: 'string'
            },
            email: {
              type: 'string'
            }
          }
        }
      }
    }

  },
  $async: true,
  additionalProperties: false
}
