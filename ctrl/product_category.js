const { Controller } = require('egg')

class ProductController extends Controller {
  async index () {
    const { ProductCategory } = this.ctx.model
    const { generateSortParam } = this.ctx.helper.pagination
    const { body, query } = this.ctx.request
    const { sort = '-created_time' } = query

    await this.ctx.validate('schema.productCategory', body)

    const productCategories = await ProductCategory.find({}).sort(generateSortParam(sort))

    this.ctx.body = {
      data: productCategories
    }
  }
}

module.exports = ProductController
