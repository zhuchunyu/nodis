const { Controller } = require('egg')

class AccountController extends Controller {
  async index () {
    const { Account } = this.ctx.model
    const { generateSortParam } = this.ctx.helper.pagination
    const { query } = this.ctx.request
    const { limit = 10, offset = 0, sort = '-created_time' } = query

    await this.ctx.validate('schema.pagination', query)

    const accounts = await Account.find({}).limit(limit).skip(offset).sort(generateSortParam(sort))

    this.ctx.body = {
      embed: {},
      meta: {
        count: accounts.length
      },
      data: accounts
    }
  }

  async create () {
    const { body } = this.ctx.request

    await this.ctx.validate('schema.account', body)

    const { Account } = this.ctx.model
    const account = new Account(body)

    const accountRet = await account.save()

    this.ctx.body = {
      meta: {},
      data: accountRet.toObject()
    }
  }

  async get () {
    const { params } = this.ctx
    const { Account } = this.ctx.model

    await ctx.validate('schema.id', params)

    const account = await Account.findOne({_id: params.id})
    this.ctx.assert(account, '账户不存在')

    this.ctx.body = {
      embed: {},
      data: account
    }
  }

  async update () {
    const { body } = this.ctx.request

    const { params } = this.ctx
    const { Account } = this.ctx.model

    await ctx.validate('schema.id', params)
    await this.ctx.validate('schema.account', body)

    const account = await Account.findOne({_id: params.id})
    this.ctx.assert(account, '账户不存在')

    Object.assign(account, body)
    await account.save();

    this.ctx.body = {
      meta: {},
      data: account
    }
  }

  async destroy () {
    const { params } = this.ctx
    const { Account } = ctx.model

    await this.ctx.validate('schema.id', params)

    const account = await Account.findOne({
      _id: params.id,
      deleted_at: null
    })
    ctx.assert(account, 404) // TODO error handle

    Object.assign(account, {
      deleted_at: new Date()
    })
    await account.save()

    ctx.jsonBody = {
      data: account
    }
  }
}

module.exports = AccountController
