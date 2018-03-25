module.exports = {
  properties: {
    id: {
      type: 'string'
    },
    type: {
      type: 'string',
      enum: ['HEPASSPORT', 'PASSPORT', 'ADMIN']
    },
    tel: {
      type: 'string'
    }

  },
  $async: true,
  additionalProperties: false
}
