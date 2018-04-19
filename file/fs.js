const Formstream = require('formstream')
module.exports = app => {
  /**
   * 文件类
   *
   * @class Fs
   * @extends {app.Service}
   */
  class Fs extends app.Service {
    /**
     * 上传文件
     *
     * @memberof Fs
     * @returns {promise} 存储的文件
     * @description return.data      - 接口返回的数据
     * @description return.data.size - 上传的文件大小
     * @description return.data.name - 上传的文件名称
     * @description return.url       - seaweeds volume server地址
     * @description return.fid       - 文件id
     */
    async upload () {
      const { ctx, service } = this
      ctx.fileError(ctx.request.type === 'multipart/form-data', '请求类型错误')
      ctx.fileError(ctx.request.method === 'POST', '请求方法错误')
      const stream = await ctx.getFileStream()

      // 首次查询，获取fid及上传的服务器url
      const result = await service.seaweeds.fid()
      const { fid, url } = result.data
      ctx.fileError(fid, '无效的fid')
      ctx.fileError(fid, '无效的url')
      this.logger.info(result.data)

      // 构造form
      const form = new Formstream()
      form.stream(stream.fieldname, stream, stream.filename)
      const response = await service.seaweeds.upload(`${url}/${fid}`, form)
      ctx.fileError(response.status === 201, '上传文件失败')
      return {
        data: response.data,
        url,
        mimeType:stream.mimeType,
        fid
      }
    }

    /**
     * 下载文件
     *
     * @param {string} fid  -文件id
     * @memberof Fs
     * @returns {promise} 获取的文件
     * @description return.data - 接口返回的数据(buffer)
     * @description return.url  - seaweeds volume server地址
     * @description return.fid  - 文件id
     */
    async download (fid) {
      const { ctx, service } = this
      const result = await service.seaweeds.volume(fid)
      const { url } = result.data.locations[0]
      const response = await service.seaweeds.download(`${url}/${fid}`)
      ctx.fileError(response.status === 200, '获取文件失败')
      return {
        data: response.data,
        url,
        fid
      }
    }

    /**
     * 修改文件
     *
     * @param {string} fid  -文件id
     * @memberof Fs
     * @returns {promise} 被修改的文件
     * @description return.data      - 接口返回的数据
     * @description return.data.size - 上传的文件大小
     * @description return.data.name - 上传的文件名称
     * @description return.url       - seaweeds volume server地址
     * @description return.fid       - 文件id
     */
    async update (fid) {
      const { ctx, service } = this
      ctx.fileError(ctx.request.type === 'multipart/form-data', '请求类型错误')
      ctx.fileError(ctx.request.method === 'PUT', '请求方法错误')

      // 获取stream及url
      const stream = await ctx.getFileStream()
      const resp = await service.seaweeds.volume(fid)
      const { url } = resp.data.locations[0]

      // 构造from并发送
      const form = new Formstream()
      form.stream(stream.fieldname, stream, stream.filename)
      const response = await service.seaweeds.update(`${url}/${fid}`, form)
      ctx.fileError(response.status === 201, '修改文件失败')
      return {
        data: response.data,
        url,
        fid
      }
    }

    /**
     * 删除文件
     *
     * @param {string} fid  -文件id
     * @memberof Fs
     * @returns {promise} 被删除的文件
     * @description return.data       - 接口返回的数据(size字段)
     * @description return.data.size  - 被删除的文件大小
     * @description return.url        - seaweeds volume server地址
     * @description return.fid        - 文件id
     */
    async delete (fid) {
      const { ctx, service } = this
      const result = await service.seaweeds.volume(fid)
      const { url } = result.data.locations[0]
      const response = await service.seaweeds.delete(`${url}/${fid}`)
      ctx.fileError(response.status === 202, '删除文件失败')
      return {
        data: response.data,
        url,
        fid
      }
    }
  }
  return Fs
}
