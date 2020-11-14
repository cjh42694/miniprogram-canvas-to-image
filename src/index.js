
/**
 * @description 统一接口请求
 * @param {String} cmd 微信接口名称
 * @param {Object} options 请求参数
 * @param {Array}  rest 微信请求接口额外参数
 * @return {Promise}
 */
const api = function (cmd, options = {}, ...rest) {
    return new Promise((resolve, reject) => {
        if (!wx[cmd]) {
            reject('is not a wxApi')
        }
        options.success = (res) => {
            resolve(res)
        }
        options.fail = (err) => {
            reject(err)
        }
        wx[cmd](options, ...rest)
    })
}
const reAuth = function (scope) {
    return new Promise((resolve, reject) => {
        wx.showModal({
            title: '请前往权限设置列表页进行授权',
            showCancel: true,
            success() {
                wx.openSetting({
                    success: (res) => {
                        if (res.authSetting[scope]) {
                            return resolve(res)
                        }
                        reject({
                            message: `权限${scope}未授权`
                        })
                    }
                })
            },
            fail() {
                reject({
                    message: `权限${scope}未授权`
                })
            }
        })
    })
}
Component({
    properties: {
        desiginWidth: {
            type: Number,
            value: 750
        },
        // 海报背景图
        bgImage: {
            type: Object,
            value: ''
        },
        // 二维码/小程序图
        qrCode: {
            type: Object,
            value: {}
        },
        // 分享语
        shareText: {
            type: Array,
            value: []
        },
        // 分享图片
        shareImage: {
            type: Array,
            value: []
        },
        // 显示分享图
        show: {
            type: Boolean,
            value: false
        }
    },
    observers: {
        show(val) {
            if (!val) return
            const {
                bgImage,
                qrCode
            } = this.properties
            if (!bgImage.width) {
                return this.triggerEvent('error', {
                    message: 'bgImage.width不能为空'
                })
            }
            if (!bgImage.height) {
                return this.triggerEvent('error', {
                    message: 'bgImage.height不能为空'
                })
            }
            if (!bgImage.url) {
                return this.triggerEvent('error', {
                    message: 'bgImage.url不能为空'
                })
            }
            if (!qrCode) {
                return this.triggerEvent('error', {
                    message: 'qrCode不能为空'
                })
            }
            const query = this.createSelectorQuery()
            query.select('#showCanvas').fields({
                node: true,
                size: true
            }).exec((res) => {
                const canvas = res[0].node
                const {width, height} = this.properties.bgImage
                const {desiginWidth} = this.properties
                canvas.width = width
                canvas.height = height
                const showCtx = canvas.getContext('2d')
                const zoom = width / desiginWidth
                this.setData({
                    showCtx,
                    canvas,
                    showStyle: {
                        width,
                        height
                    },
                    zoom
                }, () => {
                    this._initTimeline()
                })
            })
        }
    },
    data: {
        zoom: 1,
        showCtx: '',
        showStyle: {
            width: '',
            height: ''
        },
        canvas: ''
    },
    methods: {
        _initTimeline() {
            this.triggerEvent('beforecreate');
            const {
                qrCode,
                bgImage,
                shareText,
                shareImage,
                canvas,
                zoom
            } = this.properties
            const {
                width,
                height,
                url
            } = bgImage
            const {
                showCtx,
            } = this.data
            console.log(this.properties, '---入参---')
            const pipe = (...rest) => (x) => rest.reduce((p, fun) => p.then(fun), Promise.resolve(x))
            // 获取用户信息
            const getBackground = () => new Promise((resolve, reject) => {
                const bg = canvas.createImage()
                bg.src = url
                bg.onload = () => resolve(bg)
                bg.onerror = (err) => reject(err)
            })
            // 绘制背景图
            const drawBackground = (res) => {
                console.log(res)
                showCtx.drawImage(
                    res,
                    0,
                    0,
                    width * zoom,
                    height * zoom
                )
                showCtx.save()
                return Promise.resolve()
            }
            // 绘制分享图片
            const getShareImage = () => {
                if (!shareImage.length) return Promise.resolve([])
                return new Promise((resolve, reject) => {
                    Promise.all(shareImage.map((img) => new Promise((resolve, reject) => {
                        const bg = canvas.createImage()
                        bg.src = img.url
                        bg.onload = () => res(bg)
                        bg.onerror = (err) => rej(err)
                    }))).then(([...imgList]) => {
                        resolve(imgList)
                    }).catch((err) => {
                        reject(err)
                    })
                })
            }
            const drawShareImage = (imageInfo) => {
                imageInfo.length && imageInfo.forEach((item, index) => {
                    const ele = shareImage[index]
                    showCtx.drawImage(
                        item,
                        ele.x * zoom,
                        ele.y * zoom,    
                        ele.width * zoom,
                        ele.height *zoom
                    )
                    showCtx.restore()
                    showCtx.save()
                })
                return Promise.resolve()
            }
            // 分享文案格式化
            const formatShareText = () => {
                const shareTextTrans = []
                shareText.length && shareText.forEach((item) => {
                    const maxWidth = parseInt(item.maxWidth || 750, 10)
                    let lineHeight
                    const valueArr = [...item.value].filter((a) => a !== undefined)
                    item.lineHeight = item.lineHeight || 1
                    if (!isNaN(item.lineHeight)) {
                        lineHeight = (item.fontSize || 16) * item.lineHeight
                    } else {
                        lineHeight = parseInt(item.lineHeight, 10)
                    }
                    let lineWidth = 0
                    let paddingHeight = 0
                    // 分割过长value值
                    function splitValue(arr) {
                        console.log(arr)
                        if (arr.length === 0) return false
                        for (let i = 0; i < arr.length; i++) {
                            showCtx.font = `normal normal ${item.fontSize}px sans-serif`
                            const metrics = showCtx.measureText(arr[i])
                            lineWidth += metrics.width
                            if (lineWidth > maxWidth) {
                                console.log(lineWidth, maxWidth)
                                shareTextTrans.push({
                                    ...item,
                                    value: arr.splice(0, i).join(''),
                                    y: item.y + paddingHeight
                                })
                                paddingHeight += lineHeight
                                lineWidth = 0
                                splitValue(arr)
                                return true
                            }
                        }
                        if (lineWidth < maxWidth) {
                            shareTextTrans.push({
                                ...item,
                                value: arr.join(''),
                                y: item.y + paddingHeight
                            })
                        }
                        return true
                    }
                    splitValue(valueArr)
                    paddingHeight = 0
                })
                return shareTextTrans
            }
            // 分享文案绘制
            const drawShareText = () => {
                const shareTextTrans = formatShareText()
                shareTextTrans.length && shareTextTrans.forEach((item) => {
                    // 字体重置
                    showCtx.font = `normal normal ${item.fontSize * zoom}px sans-serif`
                    showCtx.fillStyle = item.color || 'black'
                    showCtx.textAlign = item.textAlign || 'left'
                    showCtx.textBaseline = item.verticalAlign || 'normal'
                    showCtx.fillText(item.value, item.x * zoom, item.y * zoom)
                    showCtx.save()
                })
                return Promise.resolve()
            }
            const getQrcode = () => new Promise((resolve, reject) => {
                const bg = canvas.createImage()
                bg.src = qrCode.url
                bg.onload = () => resolve(bg)
                bg.onerror = (err) => reject(err)
            })
            // 绘制二维码
            const drawQrcode = (qrcodeImage) => {
                // 自定义canvas事件触发
                this.triggerEvent('custom', {
                    showCtx
                })
                // 绘制二维码
                // 小程序码的位置，默认位置为左下角
                showCtx.drawImage(
                    qrcodeImage,
                    (qrCode.x *zoom),
                    (qrCode.y * zoom),
                    (qrCode.width * zoom),
                    (qrCode.height * zoom)
                )
                showCtx.restore()
                showCtx.save()
                return Promise.resolve(true)
            }
            const drawFinish = () => {
                console.log('---ws-moments---初始化完成')
                this.triggerEvent('createdSuccess', {
                    showCtx
                })
            }
            const catchError = (error) => {
                console.error('---ws-moments 出错---', error)
                this.triggerEvent('error', {
                    message: '绘制出错，请查看error信息',
                    error
                })
            }

            pipe(
                getBackground,
                drawBackground,
                getShareImage,
                drawShareImage,
                drawShareText,
                getQrcode,
                drawQrcode,
                drawFinish
            )().catch(catchError)
        },

        // 保存图片到本地
        _saveImgIntoPhotos() {
            const {
                canvas,
                width,
                height
            } = this.properties
            this.triggerEvent('beforesave')
            api('canvasToTempFilePath', {
                canvas,
                width,
                height,
                destWidth: width,
                destHeight: height
            }, this).then((res) => {
                console.log('---canvas转换图片成功---', res)
                return api('saveImageToPhotosAlbum', {
                    filePath: res.tempFilePath
                })
            }).then((res) => {
                console.log('---保存图片成功---', res)
                this.triggerEvent('saved', {
                    download: true,
                    data: res
                })
            }).catch((error) => {
                console.error('-------保存出错误', error)
                this.triggerEvent('error', {
                    download: false,
                    error,
                    message: '保存出错，请查看error信息'

                })
            })
        },

        // 保存图片
        saveImage() {
            api('getSetting').then((res) => {
                if (!res.authSetting['scope.writePhotosAlbum']) {
                    api('authorize', {
                        scope: 'scope.writePhotosAlbum'
                    }).then(() => {
                        this._saveImgIntoPhotos()
                    }).catch(() => {
                        const self = this
                        reAuth('scope.writePhotosAlbum').then(() => {
                            self._saveImgIntoPhotos()
                        }).catch((err) => {
                            console.log('reWritePhotosAlbumErr', err)
                        })
                    })
                } else {
                    this._saveImgIntoPhotos()
                }
            })
        }
    }
})
