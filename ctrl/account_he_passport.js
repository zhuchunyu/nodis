const { Controller } = require('egg')

class AccountController extends Controller {
  async index () {
    const { AccountHePassport } = this.ctx.model
    const { generateSortParam } = this.ctx.helper.pagination
    const { query } = this.ctx.request
    const { limit = 10, offset = 0, sort = '-created_time' } = query

    await this.ctx.validate('schema.pagination', query)

    const accountHePassports = await AccountHePassport.find({}).limit(limit).skip(offset).sort(generateSortParam(sort))

    this.ctx.body = {
      embed: {},
      meta: {
        count: accountHePassports.length
      },
      data: accountHePassports
    }
  }

  async create () {
    const { body } = this.ctx.request
    const { AccountHePassport } = this.ctx.model

    await this.ctx.validate('schema.accountHePassport', body)

    const accountHePassport = new AccountHePassport(body)
    const accountHePassportRet = await accountHePassport.save()

    this.ctx.body = {
      meta: {},
      data: accountHePassportRet.toObject()
    }
  }

  async get () {
    const { params } = this.ctx
    const { AccountHePassport } = this.ctx.model

    await ctx.validate('schema.id', params)

    const accountHePassport = await AccountHePassport.findOne({_id: params.id})
    this.ctx.assert(accountHePassport, '和通行证账户不存在')

    this.ctx.body = {
      embed: {},
      data: accountHePassport
    }
  }

  async update () {
    const { body } = this.ctx.request
    const { params } = this.ctx
    const { AccountHePassport } = this.ctx.model

    await ctx.validate('schema.id', params)
    await this.ctx.validate('schema.accountHePassport', body)

    const accountHePassport = await AccountHePassport.findOne({_id: params.id})
    this.ctx.assert(accountHePassport, '和通行证账户不存在')

    Object.assign(accountHePassport, body)
    await accountHePassport.save();

    this.ctx.body = {
      meta: {},
      data: accountHePassport
    }
  }

  async destroy () {
    const { params } = this.ctx
    const { AccountHePassport } = ctx.model

    await this.ctx.validate('schema.id', params)

    const accountHePassport = await AccountHePassport.findOne({
      _id: params.id,
      deleted_at: null
    })
    ctx.assert(accountHePassport, 404) // TODO error handle

    Object.assign(accountHePassport, {
      deleted_at: new Date()
    })
    await accountHePassport.save()

    ctx.jsonBody = {
      data: accountHePassport
    }
  }
}

module.exports = AccountController
