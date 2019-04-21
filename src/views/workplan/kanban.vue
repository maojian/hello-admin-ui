<template>
  <div class="components-container board">
    <Kanban :key="1" :list="list1" :group="group" class="kanban todo" header-text="Todo" />
    <Kanban :key="2" :list="list2" :group="group" class="kanban working" header-text="Working" />
    <Kanban :key="3" :list="list3" :group="group" class="kanban done" header-text="Done" />
  </div>
</template>
<script>
import Kanban from '@/components/Kanban'
import { getWorkPlanKanban } from '@/api/workplan'

export default {
  name: 'WorkPlanKanban',
  components: { Kanban },
  data() {
    return {
      group: 'mission',
      list1: [],
      list2: [],
      list3: []
    }
  },
  created() {
    getWorkPlanKanban().then(res => {
      console.log(res)
      this.list1 = res.data.todoList
      this.list2 = res.data.workingList
      this.list3 = res.data.doneList
    })
  }
}
</script>
<style lang="scss">
  .board {
    width: 1000px;
    margin-left: 20px;
    display: flex;
    justify-content: space-around;
    flex-direction: row;
    align-items: flex-start;
  }
  .kanban {
    &.todo {
      .board-column-header {
        background: #4A9FF9;
      }
    }
    &.working {
      .board-column-header {
        background: #f9944a;
      }
    }
    &.done {
      .board-column-header {
        background: #2ac06d;
      }
    }
  }
</style>

