<template>
    <el-dialog :title="title" :model-value="open" @update:model-value="$emit('update:open', $event)" width="1000px" append-to-body :before-close="close" @open="handleOpen" @close="close">
      <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="退货单号" prop="returnNo">
          <el-input v-model="queryParams.returnNo" placeholder="请输入退货单号" clearable size="small" @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="发货单号" prop="deliveryNo">
          <el-input v-model="queryParams.deliveryNo" placeholder="请输入发货单号" clearable size="small" @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="合同编号" prop="contractNo">
          <el-input v-model="queryParams.contractNo" placeholder="请输入合同编号" clearable size="small" @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="客户名称" prop="customerName">
          <el-input v-model="queryParams.customerName" placeholder="请输入客户名称" clearable size="small" @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="退货日期">
          <el-date-picker v-model="daterangeReturnDate" size="small" style="width: 240px" value-format="yyyy-MM-dd" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
  
      <el-table v-loading="loading" :data="saleReturnList">
        <el-table-column v-if="!isSingle" type="selection" width="55" align="center" />
        <el-table-column label="编号" align="center" prop="id" />
        <el-table-column label="退货单号" align="center" prop="returnNo" />
        <el-table-column label="发货单号" align="center" prop="deliveryNo" />
        <el-table-column label="合同编号" align="center" prop="contractNo" />
        <el-table-column label="客户名称" align="center" prop="customName" />
        <el-table-column label="退货日期" align="center" prop="returnDate" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.returnDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="退款金额" align="center" prop="returnAmount" />
        <el-table-column label="入库状态" align="center" prop="status">
          <template #default="scope">
            <dict-tag :options="scm_put_status" :value="scope.row.status"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button size="mini" type="text" @click="handleSelect(scope.row)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
    </el-dialog>
  </template>

  <script setup>
    import {listReturn} from '@/api/scm/return'
    import {ref , onMounted , getCurrentInstance} from 'vue'
    import Pagination from '@/components/Pagination'
    defineProps({
        open: {
      type: Boolean,
      default: false,
    },
    // 弹出层标题
    title: {
      type: String,
      default: "选择退货单",
    },
    //是否单选
    isSingle: {
      type: Boolean,
      default: true,
    },
    })
    const {proxy} = getCurrentInstance()
    const {
        scm_put_status
    } = proxy.useDict(
        "scm_put_status"
    )
    const loading = ref(true)
    const ids = ref([])
    const single = ref(true)
    const multiple = ref(true)
    const showSearch = ref(true)
    const total = ref(0)
    const saleReturnList = ref([])
    const daterangeReturnDate = ref([])
    const queryParams = ref({
        pageNum: 1,
        pageSize: 10,
        returnNo: null,
        deliveryNo: null,
        contractNo: null,
        customName: null,
        returnDate: null,
        status: '0',
    })
    const handleOpen = async () => {
        getList()
    }
    const handleSelect = async (row) => {
        emit('onSaleReturnSelected',row) 
    }
    const getList = async (paginationParams) => {
        loading.value = true
        if(paginationParams){
            queryParams.value.pageNum = paginationParams.page
            queryParams.value.pageSize = paginationParams.limit
        }
        queryParams.value.params = {}
        if(daterangeReturnDate.value && daterangeReturnDate.value === 2){
            queryParams.value.params.beginReturnDate = daterangeReturnDate.value[0]
            queryParams.value.params.endReturnDate = daterangeReturnDate.value[1]

        }
        listReturn(queryParams.value).then(res => {
            saleReturnList.value = res.rows
            total.value= res.total
            loading.value = false
        })
    }
    const handleQuery = async () => {
        queryParams.value.pageNum = 1
        getList()
    }
    const resetQuery = async () => {
        daterangeReturnDate.value = []
        queryForm.value.resetFields()
        handleQuery()
    }
    const emit = defineEmits(['update:open','close','fun','onSaleReturnSelected'])
// 关闭对话框逻辑
    const close = () => {
  emit('update:open', false) // 同步关闭状态
  emit('close')              // 触发关闭事件
}
onMounted(() => handleOpen())
</script>