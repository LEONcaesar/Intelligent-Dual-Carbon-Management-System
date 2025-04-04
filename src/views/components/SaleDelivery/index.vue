<template>
  <div class="app-container">
    <el-dialog title="发货单" @open="getList" :model-value="open" @update:model-value="$emit('update:open', $event)" @close="close" :before-close="close" append-to-body>

      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="发货编号" prop="deliveryNo">
          <el-input
            v-model="queryParams.deliveryNo"
            placeholder="请输入发货编号"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="合同编号" prop="contractNo">
          <el-input
            v-model="queryParams.contractNo"
            placeholder="请输入合同编号"
            clearable
            @keyup.enter.native="handleQuery"
          />

        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="default" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="default" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>


      <el-table v-loading="loading" :data="deliveryList">
        <el-table-column label="编号" align="center" prop="id" />
        <el-table-column label="发货编号" align="center" prop="deliveryNo" />
        <el-table-column label="合同编号" align="center" prop="contractNo" />
        <el-table-column label="客户名称" align="center" prop="customName" />
        <el-table-column label="送货方式" align="center" prop="shipping">
          <template #default="scope">
            <dict-tag :options="scm_shipping_type" :value="scope.row.shipping"/>
          </template>
        </el-table-column>
        <el-table-column label="交货日期" align="center" prop="deliveryDate" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.deliveryDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="收货地址" align="center" prop="address" />
        <el-table-column label="联系人" align="center" prop="linkman" />
        <el-table-column label="联系电话" align="center" prop="contactWay" />
        <el-table-column label="出库状态" align="center" prop="status">
          <template #default="scope">
            <dict-tag :options="scm_cargo_status" :value="scope.row.status"/>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark" />
        <el-table-column label="创建时间" align="center" prop="createTime" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button
              size="default"
              type="text"
              @click="submitForm(scope.row)"
            >选择</el-button>
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
import {listDelivery} from "@/api/scm/delivery";
import {ref , onMounted , getCurrentInstance} from 'vue'
import Pagination from '@/components/Pagination'
defineProps({
  open: {
      type: Boolean,
      default: false
    }
})
const {proxy} = getCurrentInstance()
  const {
    scm_cargo_status,
    scm_shipping_type
  } = proxy.useDict(
    "scm_cargo_status",
    "scm_shipping_type"
  )
const loading = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const showSearch = ref(true)
const total = ref(0)
const deliveryList = ref([])
const title = ref("")
const queryForm = ref(null)
const queryParams = ref({
        pageNum: 1,
        pageSize: 10,
        deliveryNo: null,
        contractNo: null,
        customId: null,
        deliveryDate: null,
        status: 0,
        createTime: null,
})
const form = ref({})
const getList = async (paginationParams) => {
  loading.value = true;
    if(paginationParams){
        queryParams.value.pageNum = paginationParams.page
        queryParams.value.pageSize = paginationParams.limit
    }
    const res = await listDelivery(queryParams.value)
    deliveryList.value = res.rows
    total.value = res.total
    loading.value = false
}
const cancel = async () => {
  close()
}
const handleQuery = async () => {
    queryParams.value.pageNum = 1
    await getList()
}

const resetQuery = async () => {
    queryForm.value.resetFields()
    handleQuery()
}
const emit = defineEmits(['update:open','close','fun'])
// 关闭对话框逻辑
const close = () => {
  emit('update:open', false) // 同步关闭状态
  emit('close')              // 触发关闭事件
}
const submitForm = async (row) => {
  try {
    emit('fun', row) 
    console.log(row)
    close()                 // 提交后关闭对话框
  } catch (error) {
    console.error('提交失败:', error)
  }
}
onMounted (() => getList())
</script>
