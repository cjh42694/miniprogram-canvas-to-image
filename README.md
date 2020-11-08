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


js：

save() {
  this.selectComponent('#savaCanvas').saveImage();
}

```


