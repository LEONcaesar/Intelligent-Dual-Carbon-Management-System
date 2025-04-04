<template>
    <div class="app-container">
      <el-dialog title="选择计划排产" :model-value="open" @update:model-value="$emit('update:open', $event)" width="1000px" append-to-body @close="close" @open="handleOpen">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item label="流水号" prop="serialNo">
            <el-input
              v-model="queryParams.serialNo"
              placeholder="请输入流水号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="计划号" prop="planNumber">
            <el-input
              v-model="queryParams.planNumber"
              placeholder="请输入计划号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="productionList">
          <el-table-column label="编号" align="center" prop="id"/>
          <el-table-column label="流水号" align="center" prop="serialNo"/>
          <el-table-column label="计划号" align="center" prop="planNumber"/>
          <el-table-column label="产品" align="center" prop="materialName"/>
          <el-table-column label="型号" align="center" prop="materialModel"/>
          <el-table-column label="规格" align="center" prop="materialSpecifications"/>
          <el-table-column label="单位" align="center" prop="materialUnit"/>
          <el-table-column label="BOM" align="center" prop="bomName"/>
          <el-table-column label="生产线" align="center" prop="productionLine"/>
          <el-table-column label="工艺" align="center" prop="technologyName"/>
          <el-table-column label="项目" align="center" prop="projectName"/>
          <el-table-column label="待产数量" align="center" prop="producedQuantity"/>
          <el-table-column label="已产数量" align="center" prop="quantityProduced"/>
          <el-table-column label="生产日期" align="center" prop="manufactureDate">
            <template #default="scope">
              <span>{{ parseTime(scope.row.manufactureDate, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="交货日期" align="center" prop="deliveryDate">
            <template #default="scope">
              <span>{{ parseTime(scope.row.deliveryDate, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="发布状态" align="center" prop="status">
            <template #default="scope">
              <dict-tag :options="mes_publish_status" :value="scope.row.status"/>
            </template>
          </el-table-column>
          <el-table-column label="领料状态" align="center" prop="pickingStatus">
            <template #default="scope">
              <dict-tag :options="mes_picking_status" :value="scope.row.pickingStatus"/>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
            <template #default="scope">
              <el-button
                size="small"
                link
                @click="submitForm(scope.row)"
              >选择
              </el-button>
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
import {listProduction} from '@/api/mes/production.js'
import{ref,onMounted,getCurrentInstance} from 'vue'
import Pagination from '@/components/Pagination'
const {proxy} = getCurrentInstance()
const {
    mes_publish_status,
    mes_picking_status
} = proxy.useDict(
    "mes_publish_status",
    "mes_picking_status"
)
defineProps({
  open: { type: Boolean, required: true },
  pickingStatus: { type: String, default: '0' }
})
const pickingStatus = ref(null)
const loading = ref(true)
const showSearch = ref(true)
const total = ref(0)
const productionList = ref([])
const title = ref("")
const queryParams = ref({
    pageNum:1,
    pageSize:10,
    serialNo:null,
    planNumber:null,
    pickingStatus:pickingStatus.value,
    status:1
})
const handleOpen = async () => {
    getList()
}
const getList = async (paginationParams) => {
    if(paginationParams){
        queryParams.value.pageNum = paginationParams.page
        queryParams.value.pageSize = paginationParams.limit
    }
    const res = await listProduction(queryParams.value)
    productionList.value = res.rows
    total.value = res.total
    loading.value = false
}
const handleQuery = async () => {
    queryParams.value.pageNum = 1
    await getList()
}
const resetQuery = async () => {
    queryForm.value.resetFields()
    await handleQuery()
}


const emit = defineEmits(['update:open', 'close', 'fun'])

// 关闭对话框逻辑
const close = () => {
  emit('update:open', false) // 同步关闭状态
  emit('close')              // 触发关闭事件
}

// 表单提交逻辑
const submitForm = async (row) => {
  try {
    emit('fun', row)        // 传递数据给父组件
    close()                 // 提交后关闭对话框
  } catch (error) {
    console.error('提交失败:', error)
  }
}
</script>