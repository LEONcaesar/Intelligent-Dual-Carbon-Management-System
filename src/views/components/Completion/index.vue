<template>
    <div class="app-container">
      <el-dialog title="生产完工单" @open="getList" :model-value="open" @update:model-value="$emit('update:open', $event)" @close="close" :before-close="close" append-to-body>
  
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item label="生产计划" prop="planNumber">
            <el-input
              v-model="queryParams.planNumber"
              placeholder="请输入生产计划"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="生产作业" prop="jobName">
            <el-input
              v-model="queryParams.jobName"
              placeholder="请输入生产作业"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="产品" prop="materialName">
            <el-input
              v-model="queryParams.materialName"
              placeholder="请输入产品"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="完工日期">
            <el-date-picker
              v-model="daterangeCompletionDate"
              style="width: 240px"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="生产批号" prop="batchNumber">
            <el-input
              v-model="queryParams.batchNumber"
              placeholder="请输入生产批号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
  
  
        <el-table v-loading="loading" :data="completionList">
          <el-table-column label="编号" align="center" prop="id" />
          <el-table-column label="单号" align="center" prop="oddNumbers" />
          <el-table-column label="生产计划" align="center" prop="planNumber" />
          <el-table-column label="生产作业" align="center" prop="jobName" />
          <el-table-column label="产品" align="center" prop="materialName" />
          <el-table-column label="型号" align="center" prop="materialModel" />
          <el-table-column label="规格" align="center" prop="materialSpecifications" />
          <el-table-column label="单位" align="center" prop="materialUnit" />
          <el-table-column label="完工日期" align="center" prop="completionDate" width="180">
            <template #default="scope">
              <span>{{ parseTime(scope.row.completionDate, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="生产数量" align="center" prop="quantity" />
          <el-table-column label="生产批号" align="center" prop="batchNumber" />
          <el-table-column label="状态" align="center" prop="status">
            <template #default="scope">
              <dict-tag :options="mes_production_completion_status" :value="scope.row.status"/>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
            <template #default="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="submitForm(scope.row)"
              >选择
              </el-button
              >
            </template>
          </el-table-column>
        </el-table>
  
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
  
  
      </el-dialog>
    </div>
  </template>
  
<script setup>
import {listCompletion} from "@/api/mes/completions";
import {ref , onMounted , getCurrentInstance} from 'vue'
import Pagination from '@/components/Pagination'
defineProps({
    open: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      default: '',
    },
})
const {proxy} = getCurrentInstance()
const {
    mes_production_completion_status
} = proxy.useDict(
    "mes_production_completion_status"
)
const loading = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const showSearch = ref(true)
const total = ref(0)
const daterangeCompletionDate = ref([])
const completionList = ref([])
const queryParams = ref({
    pageNum: 1,
    pageSize: 10,
    planNumber: null,
    jobName: null,
    materialName: null,
    completionDate: null,
    batchNumber: null,
    status: status.value
})
const form = ref({})
const getList = async (paginationParams) => {
    loading.value = true
    if(paginationParams){
            queryParams.value.pageNum = paginationParams.page
            queryParams.value.pageSize = paginationParams.limit
        }
    queryParams.params = {}
    if(daterangeCompletionDate.value && daterangeCompletionDate.value ===2){
        queryParams.value.params.beginCompletionDate = daterangeCompletionDate.value[0]
        queryParams.value.params.endCompletionDate = daterangeCompletionDate.value[1]

    }
    listCompletion(queryParams.value).then(res => {
        completionList.value = res.rows
        total.value = res.total
        loading.value = false
    })
}
const cancel = async () => {
    close()
}
const handleQuery = async () => {
    queryParams.value.pageNum = 1
    getList()
}
const resetQuery = async () => {
    daterangeCompletionDate.value = []
    queryForm.value.resetFields()
    handleQuery()
}
const emit = defineEmits(['update:open','close','fun'])
// 关闭对话框逻辑
const close = () => {
  emit('update:open', false) // 同步关闭状态
  emit('close')              // 触发关闭事件
}

// 表单提交逻辑
const submitForm = async (row) => {
  try {
    emit('fun', row) 
    console.log(row)
    close()                 // 提交后关闭对话框
  } catch (error) {
    console.error('提交失败:', error)
  }
}
</script>
  