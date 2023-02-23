export const CELLS = [
  {
    id: '0',
    index: 0,
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    component: shallowRef(defineAsyncComponent(() => import('./GridCellOne.vue'))),
  },
  {
    id: '1',
    index: 0,
    x: 200,
    y: 0,
    width: 100,
    height: 100,
    component: shallowRef (defineAsyncComponent(() => import('./GridCellTwo.vue'))),
  },
]
