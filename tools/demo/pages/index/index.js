Page({
  data: {

    bgImage: {
      width: 500,
      height: 889,
      url: '/pages/images/demo.jpg'
    },
    shareImage: [
      {
        url: '/pages/images/qrcode.jpg',
        x: 100,
        y: 200,
        width: 150,
        height: 150,
      }
    ],
    qrCode: {
      url: '/pages/images/qrcode.jpg',
      x: 200,
      y: 200,
      width: 150,
      height: 150
    },
    shareText: [
      {
        value: '测试文案第一行',
        color: '#4a4a4a',
        fontSize: 36,
        x: 60,
        y: 400,
        maxWidth: 500,
        lineHeight: 1.2,
      },
      {
        value: '测试文案真的很长,要换行了',
        color: '#4a4a4a',
        fontSize: 36,
        x: 60,
        y: 500,
        maxWidth: 200,
        lineHeight: 1.2,
      },
    ]
  },
  onLoad() {

  },
  save() {
    this.selectComponent('#savaCanvas').saveImage()
  },
  showError(e) {
    console.log(e)
  }

})
