<template>
  <div class="app-container">
    <el-dialog title="选择领料单" @open="getList" @close="close" :model-value="open" @update:model-value="$emit('update:open', $event)" append-to-body>
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="物料" prop="materialName">
          <el-input
            v-model="queryParams.materialName"
            placeholder="请输入物料"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="default" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="default" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table v-loading="loading" :data="applyList" @row-click="handleSelectionChange" >
        <el-table-column label="编号" align="center" prop="id"/>
        <el-table-column label="领料单号" align="center" prop="oddNumber"/>
        <el-table-column label="生产计划" align="center" prop="planNumber"/>
        <el-table-column label="计划排产" align="center" prop="serialNo"/>
        <el-table-column label="产品" align="center" prop="materialName"/>
        <el-table-column label="规格" align="center" prop="materialModel"/>
        <el-table-column label="型号" align="center" prop="materialSpecifications"/>
        <el-table-column label="单位" align="center" prop="materialUnit"/>
        <el-table-column label="领取日期" align="center" prop="collectionDate">
          <template #default="scope">
            <span>{{ parseTime(scope.row.collectionDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" prop="status">
          <template #default="scope">
            <dict-tag :options="mes_material_status" :value="scope.row.status"/>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template #default="scope">
            <el-button
              size="default"
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

      <!-- 添加或修改领料申请对话框 -->


    </el-dialog>
  </div>
</template>

<script setup>
import {listApply} from "@/api/mes/apply";
import {ref , onMounted , getCurrentInstance} from 'vue'
import Pagination from '@/components/Pagination'
defineProps({
  open: {type: Boolean,required: true},
  status: {type: String,default: null}
})
const {proxy} = getCurrentInstance()
const {
    mes_auditor_status,
    mes_apply_status,
    mes_material_status
  } = proxy.useDict(
    "material_type"
  )
const loading = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const showSearch = ref(true)
const total = ref(0)
const applyList = ref(undefined)
const mesMaterialApplyItemList = ref(undefined)
const title = ref("")
const queryParams = ref({
        pageSize: 10,
        pageNum: 1,
        materialName: null,
        materialModel: null,
        materialSku: null,
        materialUnit: null,
        demandQuantity: null,
        receivedQuantity: null,
        status: status.value,
        reviewerStatus: 1,
        applyId: null
})
const form = ref({})
const getList = async (paginationParams) => {
  if(paginationParams){
        queryParams.value.pageNum = paginationParams.page
        queryParams.value.pageSize = paginationParams.limit
    }
    const res = await listApply(queryParams.value)
    applyList.value = res.rows
    total.value = res.total
    loading.value = false
}
const emit = defineEmits(['update:open','close','fun'])
const close = async () => {
  emit('update:open',false)
  emit('close')
}
const handleQuery = async () => {
    queryParams.value.pageNum = 1
    await getList()
}

const resetQuery = async () => {
    queryForm.value.resetFields()
    handleQuery()
}
const submitForm = async (row) => {
  emit('fun',row)
  close()
}
onMounted(() => getList())
</script>
