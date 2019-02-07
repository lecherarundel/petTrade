// mine.js
 var app = getApp();
const AVLeanCloud = require('../../utils/av-weapp-min-leancloud.js');
// 自定义标签
var iconPath = "../../images/icons/"
var tabs = [
    {
        "icon": iconPath + "mark.png",
        "iconActive": iconPath + "markHL.png",
        "title": "交易",
        "extraStyle": "",
    },
    {
        "icon": iconPath + "collect.png",
        "iconActive": iconPath + "collectHL.png",
        "title": "收藏",
        "extraStyle": "",
    },
    {
        "icon": iconPath + "like.png",
        "iconActive": iconPath + "likeHL.png",
        "title": "喜欢",
        "extraStyle": "",
    },
    {
        "icon": iconPath + "more.png",
        "iconActive": iconPath + "moreHL.png",
        "title": "更多",
        "extraStyle": "border:none;",
    },
]
var userInfo = {
    avatar: "https://pic4.zhimg.com/e515adf3b_xl.jpg",
    nickname: "小闹钟",
    sex: "♂",  // 0, male; 1, female
    meta: '1篇日记',
}


Page({
    leanCloudUserData:{ 
        user: {
          nickname: "",
          avatarUrl: "",
        }},

    // data
    data: {
        // 展示的tab标签
        tabs: tabs,

        // 当前选中的标签
        currentTab: "tab1",

        // 高亮的标签索引
        highLightIndex: "0",

        // 模态对话框样式 
        modalShowStyle: "",

        // 待新建的日记标题
        diaryTitle: "",

        // 用户信息
    userInfo: {
        avatarUrl: app.globalData.userInfo.avatarUrl,
        nickName: app.globalData.userInfo.nickName,
        code:""
      },
      bType: "primary", // 按钮类型
      actionText: "登录", // 按钮文字提示
      lock: false //登录按钮状态，false表示未登录
    },

    // 隐藏模态框
    hideModal() {
        this.setData({modalShowStyle: ""});
    },

    // 清除日记标题
    clearTitle() {
        this.setData({diaryTitle: ""});
    },

    onShow: function() {
        this.hideModal();
        this.clearTitle();
        this.setData({
          avatarUrl: app.globalData.userInfo.avatarUrl,
          nickName: app.globalData.userInfo.nickName,
          code: ""
        })
    },

    // 点击tab项事件
    touchTab: function(event){
        var tabIndex = parseInt(event.currentTarget.id);
        var template = "tab" + (tabIndex + 1).toString();

        this.setData({
            currentTab: template,
            highLightIndex: tabIndex.toString()
        }
        );
    },

    // 点击新建日记按钮
    touchAdd: function (event) {
        this.setData({
            modalShowStyle: "opacity:1;pointer-events:auto;"
        })
    },

    // 新建日记
    touchAddNew: function(event) {
        this.hideModal();
        
        wx.navigateTo({
            url: "../new/new?title=" + this.data.diaryTitle,
        });
    },

    // 取消标题输入
    touchCancel: function(event) {
        this.hideModal();
        this.clearTitle();
    }, 

    // 标题输入事件
    titleInput: function(event) {
        this.setData({
            diaryTitle: event.detail.value,
        })
    },

    // 登录或退出登录按钮点击事件
  bindAction: function(){
    this.data.lock = !this.data.lock
    // 如果没有登录，登录按钮操作
    if(this.data.lock){
      wx.showLoading({
        title: "正在登录"
      });
      wx.login({
        success: (res) => {
          console.log(res)
          wx.hideLoading();
          wx.getUserInfo({
            withCredentials: false,
            success: (res) => {
              console.log(res)
              AVLeanCloud.User.loginWithWeapp().then(user => {
                this.leanCloudUserData.user.avatarUrl = res.userInfo.avatarUrl,
                this.leanCloudUserData.user.nickname = res.userInfo.nickName
                this.leanCloudUserData.user = user.toJSON();
                app.globalData.username = user.attributes.username
                console.log(app.globalData.username)
                //save in leanCloud
                user.set(res.userInfo).save().then(user => {
                  // 成功，此时可在控制台中看到更新后的用户信息
                  //this.globalData.user = user.toJSON();
                }).catch(console.error);
              }).catch(console.error);

              // //save in leanCloud
              // user.set(res.userInfo).save().then(user => {
              //   // 成功，此时可在控制台中看到更新后的用户信息
              //   //this.globalData.user = user.toJSON();
              // }).catch(console.error);
              if (res.userInfo.gender)
              {
                var sex = "♂"
              }
              else{
                var sex = "♀"
              }
              
              this.setData({
                userInfo: {
                  avatarUrl: res.userInfo.avatarUrl,
                  nickName: res.userInfo.nickName,
                  gender: sex,
                  meta:res.userInfo.signature
                },
                bType: "warn",
                actionText: "退出登录"
              });
              // 存储用户信息到本地
              wx.setStorage({
                key: 'userInfo',
                data: {
                  userInfo: {
                    avatarUrl: res.userInfo.avatarUrl,
                    nickName: res.userInfo.nickName,
                    gender:sex,
                    meta: res.userInfo.signature
                  },
                  bType: "warn",
                  actionText: "退出登录"
                },
                success: function(res){
                  console.log("存储成功")
                }
              })
            },
            fail: function (error) { console.log(error) }
          })
        }
      })
    // 如果已经登录，退出登录按钮操作     
    }else{
      wx.showModal({
        title: "确认退出?",
        content: "退出后将不能使用芒果宠物交易",
        success: (res) => {
          if(res.confirm){
            console.log("确定")
            // 退出登录则移除本地用户信息
            wx.removeStorageSync('userInfo')
            this.setData({
              userInfo: {
                avatarUrl: "",
                nickName: "未登录"
              },
              bType: "primary",
              actionText: "登录"
            })
          }else {
            console.log("cancel")
            this.setData({
              lock: true
            })
          }
        }
      })
    }   
  }
})
