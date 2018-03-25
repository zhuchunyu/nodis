const { Controller } = require('egg')

class AccountAdminController extends Controller {
  async index () {
    const { AccountAdmin } = this.ctx.model
    const { generateSortParam } = this.ctx.helper.pagination
    const { query } = this.ctx.request
    const { limit = 10, offset = 0, sort = '-created_time' } = query

    await this.ctx.validate('schema.pagination', query)

    const accountAdmins = await AccountAdmin.find({}).limit(limit).skip(offset).sort(generateSortParam(sort))

    this.ctx.body = {
      embed: {},
      meta: {
        count: accountAdmins.length
      },
      data: accountAdmins
    }
  }

  async create () {
    const { body } = this.ctx.request

    await this.ctx.validate('schema.accountAdmin', body)

    const { AccountAdmin } = this.ctx.model

    const accountAdmin = new AccountAdmin(body)

    const accountAdminRet = await accountAdmin.save()

    this.ctx.body = {
      meta: {},
      data: accountAdminRet.toObject()
    }
  }

  async get () {
    const { params } = this.ctx
    const { AccountAdmin } = this.ctx.model

    await ctx.validate('schema.id', params)

    const accountAdmin = await AccountAdmin.findOne({_id: params.id})
    this.ctx.assert(account, '管理员账户不存在')

    this.ctx.body = {
      embed: {},
      data: accountAdmin
    }
  }

  async update () {
    const { body } = this.ctx.request

    const { params } = this.ctx
    const { AccountAdmin } = this.ctx.model

    await ctx.validate('schema.id', params)
    await this.ctx.validate('schema.accountAdmin', body)

    const accountAdmin = await AccountAdmin.findOne({_id: params.id})
    this.ctx.assert(accountAdmin, '管理员账户不存在')

    Object.assign(accountAdmin, body)
    await accountAdmin.save();

    this.ctx.body = {
      meta: {},
      data: accountAdmin
    }
  }

  async destroy () {
    const { params } = this.ctx
    const { AccountAdmin } = ctx.model

    await this.ctx.validate('schema.id', params)

    const accountAdmin = await AccountAdmin.findOne({
      _id: params.id,
      deleted_at: null
    })
    ctx.assert(accountAdmin, 404) // TODO error handle

    Object.assign(accountAdmin, {
      deleted_at: new Date()
    })
    await accountAdmin.save()

    ctx.jsonBody = {
      data: accountAdmin
    }
  }
}

module.exports = AccountAdminController
