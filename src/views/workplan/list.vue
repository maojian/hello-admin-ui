<template>
  <div class="app-container">
    <el-col class="toolbar">
      <el-form :inline="true" :model="listQuery">
        <el-form-item>
          <el-input v-model="listQuery.keyword" placeholder="关键字" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="queryUser">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button class="filler-item" type="primary" icon="el-icon-edit" @click="handleAdd">新增</el-button>
        </el-form-item>
        <el-form-item>
          <el-button class="filler-item" type="primary" icon="el-icon-setting" native-type="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <template>
      <el-table v-loading="listLoading" :data="workplanList" highlight-current-row style="width:100%" @selection-change="selectChange">
        <el-table-column type="selection" />
        <el-table-column label="编号" prop="id" />
        <el-table-column prop="nickname" label="姓名" sortable />
        <el-table-column label="标题" min-width="300px">
          <template slot-scope="scope">
            <span>{{ scope.row.title }}</span>
            <el-tag>{{ scope.row.type | typeFilter }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="内容" width="200" sortable />
        <el-table-column label="创建日期" width="150px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="修改日期" width="150px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.updateTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDel(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>

    <el-col class="toolbar">
      <el-button :disabled="selectList.length == 0" type="danger" @click="batchDel">批量删除</el-button>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" style="margin-top: 5px;float: right" @pagination="queryWorkPlanList" />
    </el-col>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="true">
      <el-form ref="dataForm" :rules="rules" :model="actForm" label-position="left" label-width="60px" style="width: 400px; margin-left:50px;">
        <el-form-item label="标题" prop="title">
          <el-input v-model="actForm.title" auto-complete="false" />
        </el-form-item>

        <el-form-item label="类型" prop="type">
          <el-select v-model="actForm.type" placeholder="选择类型" clearable class="filter-item">
            <el-option v-for="item in typeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>

        <el-form-item label="内容" prop="content">
          <el-input v-model="actForm.content" type="textarea" rows="10" />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click.native="dialogFormVisible = false">取消</el-button>
        <el-button :loading="actLoading" type="primary" @click="dialogStatus==='create'?addSubmit():editSubmit()">提交</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getWorkPlanList, delWorkPlan, batchDelWorkPlan, editWorkPlan, addWorkPlan, getWorkPlan } from '@/api/workplan'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

const typeOptions = [
  { key: 1, display_name: 'TODO' },
  { key: 2, display_name: 'WORKING' },
  { key: 3, display_name: 'DONE' }
]

// arr to obj ,such as { 1 : "TODO", 2 : "WORKING" }
const typeOptionsKeyValue = typeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'WorkPlan',
  components: { Pagination },
  filters: {
    typeFilter(type) {
      return typeOptionsKeyValue[type]
    }
  },
  data() {
    return {
      total: 0,
      listQuery: {
        page: 1,
        limit: 10,
        keyword: '',
        type: undefined,
        sort: 'id'
      },
      handleFilter() {
        this.listQuery.page = 1
        this.queryWorkPlanList()
      },
      workplanList: [],
      selectList: [],
      listLoading: false,
      typeOptions,

      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      rules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        type: [{ required: true, message: '请选择类型', trigger: 'change' }],
        content: [{ required: true, message: '请输入内容', trigger: 'blur' }]
      },
      actForm: {
        id: 0,
        title: '',
        type: '',
        content: ''
      },
      actLoading: false

    }
  },
  created() {
    this.queryWorkPlanList()
  },
  methods: {
    resetActForm: function() {
      this.actForm = {
        id: 0,
        title: '',
        type: '',
        content: ''
      }
    },
    queryUser: function() {
      this.page = 1
      this.queryWorkPlanList()
    },
    queryWorkPlanList: function() {
      this.listLoading = true
      getWorkPlanList(this.listQuery).then(res => {
        console.log(res)
        this.total = res.data.total
        this.workplanList = res.data.rows
        this.listLoading = false

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    selectChange: function(selectList) {
      this.selectList = selectList
    },
    handlePage: function(val) {
      this.page = val
      this.queryWorkPlanList()
    },
    handleAdd: function() {
      this.resetActForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    addSubmit: function() {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return
        }

        this.actLoading = true
        const params = Object.assign({}, this.actForm)
        console.log('add-params', params)

        addWorkPlan(params).then(res => {
          this.actLoading = false
          this.$notify({ title: '成功', message: res.message, type: 'success' })
          this.$refs['dataForm'].resetFields()
          this.dialogFormVisible = false
          this.queryWorkPlanList()
        }).catch(res => {
          this.actLoading = false
        })
      })
    },
    handleEdit: function(index, row) {
      const params = Object.assign({}, { id: row.id })
      getWorkPlan(params).then(res => {
        console.log('get-info', res)
        this.actForm = Object.assign({}, res.data.info) // copy obj
      }).catch(res => {})

      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    editSubmit: function() {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return
        }

        this.actLoading = true
        const params = Object.assign({}, this.actForm)
        console.log('edit-params', params)

        editWorkPlan(params).then(res => {
          this.actLoading = false
          this.$notify({ title: '成功', message: res.message, type: 'success' })
          this.$refs['dataForm'].resetFields()
          this.dialogFormVisible = false
          this.queryWorkPlanList()
        }).catch(res => {
          this.actLoading = false
        })
      })
    },
    handleDel: function(index, row) {
      const params = { id: row.id }
      this.$confirm('确认删除该记录吗？', '提示', { type: 'warning' }).then(() => {
        delWorkPlan(params).then(res => {
          console.log(res)
          this.$notify({ title: '成功', message: res.message, type: 'success' })
          this.queryWorkPlanList()
        })
      }).catch(() => {})
    },
    batchDel: function() {
      const ids = this.selectList.map(item => item.id).toString()
      this.$confirm('确认删除选中记录吗？', '提示', { type: 'warning' }).then(() => {
        this.listLoading = true
        const params = { ids: ids }
        console.log(params)
        batchDelWorkPlan(params).then(res => {
          console.log(res)
          this.$notify({ title: '成功', message: res.message, type: 'success' })
          this.queryWorkPlanList()
        })
      }).catch(() => {

      })
    }
  }
}
</script>

<style scoped>

</style>
