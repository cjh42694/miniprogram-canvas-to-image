# canvas-to-image


小程序内通过传入背景图和二维码参数，生成朋友圈分享海报


## 使用方法

#### Step1. npm 安装，参考 [小程序 npm 支持](https://developers.weixin.qq.com/miniprogram/dev/devtools/npm.html)

```
npm install --save canvas-to-image
```

#### Step2. JSON 组件声明

```
{
  "usingComponents": {
    "canvas-to-image": "canvas-to-image",
  }
}
```

#### Step3. wxml 引入组件

```

  <canvas-to-image 
    width="{{width}}"
    height="{{height}}"
    shareText="{{shareText}}"
    bgImage="{{bgImage}}" 
    shareText="{{shareText}}" 
    qrCode="{{qrCode}}"
    bindbeforecreate="beforecreate"
    bindbeforesave="beforesave" 
    bindsaved="saved"
    binderror="showError"
    id="savaCanvas"
    show="{{true}}" 
>
</canvas-to-image>

```

##### 属性列表

| 属性            | 类型    | 默认值  | 必填 | 说明                   |
| --------------- | ------- | ------- | ---- | ---------------------- |
| width           | Number  |         | 是  | 海报宽度           |
| height           | Number  |         | 是   | 海报高度           |
| bgImage           | String  |         | 是   | 背景图地址           |
| qrCode           | Object  |         | 是  | 二维码配置对象           |
| shareText           | Array  |         | 否   | 分享文案配置对象数组        |
| shareImage           | Array  |         | 否   | 扩展分享图配置对象数组           |


#### Step4. js 获取实例

```
const {wxml, style} = require('./demo.js')
Page({
  data: {
    src: ''
  },
  onLoad() {
    this.widget = this.selectComponent('.widget')
  },
  renderToCanvas() {
    const p1 = this.widget.renderToCanvas({ wxml, style })
    p1.then((res) => {
      this.container = res
      this.extraImage()
    })
  },
  extraImage() {
    const p2 = this.widget.canvasToTempFilePath()
    p2.then(res => {
      this.setData({
        src: res.tempFilePath,
        width: this.container.layoutBox.width,
        height: this.container.layoutBox.height
      })
    })
  }
})
```

## wxml 模板

支持 `view`、`text`、`image` 三种标签，通过 class 匹配 style 对象中的样式。

```
<view class="container" >
  <view class="item-box red">
  </view>
  <view class="item-box green" >
    <text class="text">yeah!</text>
  </view>
  <view class="item-box blue">
      <image class="img" src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3582589792,4046843010&fm=26&gp=0.jpg"></image>
  </view>
</view>
```

## 方法

### 保存海报到相册

```
wxml:

<canvas-to-image 
    width="{{width}}"
    height="{{height}}"
    shareText="{{shareText}}"
    bgImage="{{bgImage}}" 
    shareText="{{shareText}}" 
    qrCode="{{qrCode}}"
    bindbeforecreate="beforecreate"
    bindbeforesave="beforesave" 
    bindsaved="saved"
    binderror="showError"
    id="savaCanvas"
    show="{{true}}" 
>
</canvas-to-image>
<button bindtap="save">保存到手机</button>


js
save() {
this.selectComponent('#savaCanvas').saveImage();
}

```

## 接口

#### f1. `renderToCanvas({wxml, style}): Promise`

渲染到 canvas，传入 wxml 模板 和 style 对象，返回的容器对象包含布局和样式信息。

#### f2. `canvasToTempFilePath({fileType, quality}): Promise`

提取画布中容器所在区域内容生成相同大小的图片，返回临时文件地址。

`fileType` 支持 `jpg`、`png` 两种格式，quality 为图片的质量，目前仅对 jpg 有效。取值范围为 (0, 1]，不在范围内时当作 1.0 处理。

## 支持的 css 属性

### 布局相关

| 属性名                | 支持的值或类型                                            | 默认值     |
| --------------------- | --------------------------------------------------------- | ---------- |
| width                 | number                                                    | 0          |
| height                | number                                                    | 0          |
| position              | relative, absolute                                        | relative   |
| left                  | number                                                    | 0          |
| top                   | number                                                    | 0          |
| right                 | number                                                    | 0          |
| bottom                | number                                                    | 0          |
| margin                | number                                                    | 0          |
| padding               | number                                                    | 0          |
| borderWidth           | number                                                    | 0          |
| borderRadius          | number                                                    | 0          |
| flexDirection         | column, row                                               | row        |
| flexShrink            | number                                                    | 1          |
| flexGrow              | number                                                    |            |
| flexWrap              | wrap, nowrap                                              | nowrap     |
| justifyContent        | flex-start, center, flex-end, space-between, space-around | flex-start |
| alignItems, alignSelf | flex-start, center, flex-end, stretch                     | flex-start |

支持 marginLeft、paddingLeft 等

### 文字

| 属性名          | 支持的值或类型      | 默认值      |
| --------------- | ------------------- | ----------- |
| fontSize        | number              | 14          |
| lineHeight      | number / string     | '1.4em'     |
| textAlign       | left, center, right | left        |
| verticalAlign   | top, middle, bottom | top         |
| color           | string              | #000000     |
| backgroundColor | string              | transparent |

lineHeight 可取带 em 单位的字符串或数字类型。

### 变形

| 属性名 | 支持的值或类型 | 默认值 |
| ------ | -------------- | ------ |
| scale  | number         | 1      |
