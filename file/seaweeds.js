module.exports = app => {
  /**
   * seaweeds类
   *
   * @class Seaweeds
   * @extends {app.Service}
   */
  class Seaweeds extends app.Service {
    /**
     * seaweeds上传文件
     *
     * @memberof Seaweeds
     * @param {object} form - formstream
     * @param {string} url  - 请求url地址
     * @returns {promise} 存储的文件
     */
    async upload (url, form) {
      const { ctx } = this
      const result = await ctx.curl(url, {
        method: 'POST',
        headers: form.headers(),
        stream: form,
        dataType: 'json'
      })

      return result
    }

    /**
     * seaweeds下载文件
     *
     * @param {string} url  -请求url地址
     * @memberof Seaweeds
     * @returns {promise} 获取的文件(buffer)
     */
    async download (url) {
      const { ctx } = this
      const result = await ctx.curl(url)
      return result
    }

    /**
     * seaweeds修改文件
     *
     * @param {string} url   - 请求url地址
     * @param {object} form  - formstream
     * @memberof Seaweeds
     * @returns {promise} 被修改的文件
     */
    async update (url, form) {
      const { ctx } = this

      const response = await ctx.curl(url, {
        method: 'PUT',
        headers: form.headers(),
        stream: form,
        dataType: 'json'
      })
      return response
    }

    /**
     * seaweeds删除文件
     *
     * @param {string} url  - 请求url地址
     * @memberof Seaweeds
     * @returns {promise} 被删除的文件
     */
    async delete (url) {
      const { ctx } = this

      const result = await ctx.curl(url, {
        method: 'DELETE',
        dataType: 'json'
      })
      return result
    }

    /**
     * 获取volume server url
     *
     * @param {string} id - fid
     * @memberof Fs
     * @returns {promise} volume server url
     */
    async volume (fid) {
      const { ctx } = this

      const [volumeId] = fid.split(',')
      const result = ctx.curl(`${app.config.host}/dir/lookup?volumeId=${volumeId}`, {
        dataType: 'json'
      })
      return result
    }

    /**
     * 获取fid及volume server url
     *
     * @memberof Fs
     * @returns {promise} 获取的fid及volume url
     */
    async fid () {
      const { ctx } = this
      const result = await ctx.curl(`${app.config.host}/dir/assign`, { dataType: 'json' })
      return result
    }
  }
  return Seaweeds
}
