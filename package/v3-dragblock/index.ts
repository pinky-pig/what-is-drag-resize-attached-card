import GridContainer from './GridContainer.vue'

// 组件都写在这个数组中方便管理
const componentList = [GridContainer]

// 批量注册
const install = (Vue: any) => {
  componentList.forEach((com) => {
    Vue.component(com.name, com)
  })
}

// 暴露出去
export default install
