<template>
  <div class="app-container">
    <!-- 库存物料明细 -->
    <el-dialog title="选择物料" :model-value="open" @update:model-value="$emit('update:open'.$event)"  width="1000px"  @close="close" append-to-body>
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
               label-width="68px">
        <el-form-item label="物料名称" prop="materialName">
          <el-input
            v-model="queryParams.materialName"
            placeholder="请输入物料名称"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="default" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="default" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="loading" :data="materialList">
        <el-table-column label="编号" align="center" type="index"/>
        <el-table-column label="物料名称" align="center" prop="materialName"/>
        <el-table-column label="型号" align="center" prop="materialModel"/>
        <el-table-column label="规格" align="center" prop="materialSpecifications"/>
        <el-table-column label="单位" align="center" prop="materialUnit"/>
        <el-table-column label="仓库" align="center" prop="warehouseName" />
        <el-table-column label="库区" align="center" prop="areaName" />
        <el-table-column label="库位" align="center" prop="seatName" />
        <el-table-column label="生产批号" align="center" prop="batchNumber" />
        <el-table-column label="现有库存" align="center" prop="existingInventory" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button
              size="default"
              type="text"
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
import {listInventoryDetails} from "@/api/wms/inventoryDetails";
import {ref , onMounted , getCurrentInstance} from 'vue'
import Pagination from '@/components/Pagination'
defineProps({
  open: {
      type: Boolean,
      default: false
    }
})
const loading = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const showSearch = ref(true)
const total = ref(0)
const materialList = ref([])
const title = ref("")
const queryParams = ref({
        pageNum: 1,
        pageSize: 10,
        materialName: null,
})
const form = ref({})
const formRef = ref(null)
const queryForm = ref(null)
const getList = async (paginationParams) => {
    if(paginationParams){
        queryParams.value.pageNum = paginationParams.page
        queryParams.value.pageSize = paginationParams.limit
    }
    const res = await listInventoryDetails(queryParams.value)
    materialList.value = res.rows
    total.value = res.total
    loading.value = false
}
const cancel = async () => {
  close()
  reset()
}
const reset = async () => {
  form.value = {
        id: null,
        classifyId: null,
        materialCode: null,
        materialName: null,
        materialModel: null,
        materialSpecifications: null,
        materialUnit: null,
        materialPrice: null,
        materialType: null,
        remark: null,
  }
  if(formRef.value){
    formRef.value.resetFields()
  }
}
const handleQuery = async () => {
  queryParams.value.pageNum = 1
  getList()
}
const resetQuery = async () => {
  queryForm.value.resetFields()
  handleQuery
}
const emit = defineEmits(['update:open','close','fun'])

const close = async () => {
  emit('update:open',false)
  emit('close')
}
const submitForm = async (row) => {
  emit('fun',row)
  close()
}
onMounted(() => getList())
</script>
