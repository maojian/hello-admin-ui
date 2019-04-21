import Layout from '@/layout'
import WorkPlanList from '@/views/workplan/list'
import WorkPlanKanban from '@/views/workplan/kanban'

const workPlanRouter = {
  path: '/workplan',
  component: Layout,
  name: 'workplan',
  meta: { title: 'workPlan', icon: 'form' },
  children: [
    {
      path: 'list',
      name: 'list',
      component: WorkPlanList,
      meta: { title: 'workPlanList', icon: 'list' }
    },
    {
      path: 'kanban',
      name: 'kanban',
      component: WorkPlanKanban,
      meta: { title: 'workPlanKanBan', icon: 'eye-open' }
    }
  ]
}

export default workPlanRouter
