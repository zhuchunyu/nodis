const { Controller } = require('egg')

class AccountController extends Controller {
  async index () {
    const { AccountPassport } = this.ctx.model
    const { generateSortParam } = this.ctx.helper.pagination
    const { query } = this.ctx.request
    const { limit = 10, offset = 0, sort = '-created_time' } = query

    await this.ctx.validate('schema.pagination', query)

    const accountPassports = await AccountPassport.find({}).limit(limit).skip(offset).sort(generateSortParam(sort))

    this.ctx.body = {
      embed: {},
      meta: {
        count: accountPassports.length
      },
      data: accountPassports
    }
  }

  async create () {
    const { body } = this.ctx.request

    await this.ctx.validate('schema.accountPassport', body)

    const { AccountPassport } = this.ctx.model

    const accountPassport = new AccountPassport(body)

    const accountPassportRet = await accountPassport.save()

    this.ctx.body = {
      meta: {},
      data: accountPassportRet.toObject()
    }
  }

  async get () {
    const { params } = this.ctx
    const { AccountPassport } = this.ctx.model

    await ctx.validate('schema.id', params)

    const accountPassport = await AccountPassport.findOne({_id: params.id})
    this.ctx.assert(accountPassport, 'OneNET账户不存在')

    this.ctx.body = {
      embed: {},
      data: accountPassport
    }
  }

  async update () {
    const { body } = this.ctx.request

    const { params } = this.ctx
    const { AccountPassport } = this.ctx.model

    await ctx.validate('schema.id', params)
    await this.ctx.validate('schema.accountPassport', body)

    const accountPassport = await AccountPassport.findOne({_id: params.id})
    this.ctx.assert(accountPassport, 'OneNET账户不存在')

    Object.assign(accountPassport, body)
    await accountPassport.save();

    this.ctx.body = {
      meta: {},
      data: accountPassport
    }
  }

  async destroy () {
    const { params } = this.ctx
    const { AccountPassport } = ctx.model

    await this.ctx.validate('schema.id', params)

    const accountPassport = await AccountPassport.findOne({
      _id: params.id,
      deleted_at: null
    })
    ctx.assert(accountPassport, 404)

    Object.assign(accountPassport, {
      deleted_at: new Date()
    })
    await accountPassport.save()

    ctx.jsonBody = {
      data: accountPassport
    }
  }
}

module.exports = AccountController
