<template>
  <div class="classroom-detail-container" v-if="isHave">
    <div class="classroom-info">
      <div class="classroom-name">{{detail.name}}</div>
      <div class="classroom-desc">{{detail.outline}}</div>
      <div class="classroom-desc">开始时间：{{detail.startDate}}</div>
      <div class="classroom-desc">结束时间：{{detail.endDate}}</div>
      <div class="splice-line"></div>
      <div class="user-info">
        <div class="create-date">创建于：{{detail.createdDate}}</div>
      </div>
    </div>
    <div class="sumbit-homework">
      <button class="back-btn bg-purple" disabled v-if="isSumbit">已交作业</button>
      <button class="back-btn bg-purple" @click="toPage('../homework-add/main?id=' + detail.id)" v-else>交作业</button>
    </div>
  </div>
  <div v-else>
    <div class="no-detail">暂无数据</div>
    <button class="back-btn bg-orange" @click="toBack">点击返回</button>
  </div>
</template>

<script>
import { getHomeworkTaskInfo, getHomeworksByHomeworkTaskId } from '@/api/homework'
export default {
  onLoad (options) {
    this.clearData()
    if (options.id) {
      this.homeworkTaskId = options.id
      this.getHomeworkTaskInfo()
    } else {
      this.isHave = false
    }
  },
  onShow () {
    this.getHomeworksByHomeworkTaskId()
  },
  data () {
    return {
      homeworkTaskId: undefined,
      isHave: false,
      detail: {},
      homeworkDetail: null,
      homeworkTaskList: [],
      signTaskList: []
    }
  },
  computed: {
    isSumbit () {
      if (this.homeworkDetail !== null) {
        return true
      }
      return false
    }
  },
  methods: {
    clearData () {
      this.homeworkTaskId = undefined
      this.isHave = false
      this.detail = {}
      this.homeworkDetail = null
      this.homeworkTaskList = []
      this.signTaskList = []
    },
    toBack () {
      mpvue.navigateBack({
        delta: 1
      })
    },
    toPage (url) {
      mpvue.navigateTo({ url })
    },
    async getHomeworkTaskInfo () {
      await getHomeworkTaskInfo(this.homeworkTaskId).then((data) => {
        this.detail = data
        this.isHave = true
      })
    },
    async getHomeworksByHomeworkTaskId () {
      await getHomeworksByHomeworkTaskId(this.homeworkTaskId).then((res) => {
        if (res.success === true) {
          this.homeworkDetail = res.data
        } else {
          this.homeworkDetail = null
        }
      })
    }
  }
}
</script>

<style>

  page {
    background-color: #eeeeee;
  }

  .no-detail {
    margin-top: 45%;
    text-align: center;
  }



  .back-btn {
    color: #ffffff;
    width: 35%;
    height: 75rpx;
    font-size: 35rpx;
    line-height: 75rpx;
  }

  .classroom-detail-container {
    display: flex;
    flex-direction: column;
  }

  .classroom-info {
    padding: 25rpx 20rpx 5rpx 25rpx;
    background-color: #ffffff;
  }

  .classroom-name {
    text-align: center;
    font-size: 45rpx;
  }

  .classroom-desc {
    margin-top: 25rpx;
    text-overflow: ellipsis;
    word-break: break-all;
    word-wrap: break-word;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    color: #656565;
    font-size: 35rpx;
  }

  .splice-line {
    margin: 10rpx 0;
    border-top: 1rpx solid #000000;
  }

  .user-info {
    margin-top: 5rpx;
  }

  .create-date {
    font-size: 25rpx;
    line-height: 75rpx;
    float: right;
    color: #999999;
  }

  .sumbit-homework {
    margin-top: 50rpx;
  }

</style>
