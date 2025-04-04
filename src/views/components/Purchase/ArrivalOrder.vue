<template>
    <el-dialog :title="title"@open="getList" :model-value="open" @update:model-value="$emit('update:open', $event)" width="1000px" :before-close="close" @close="close"
      append-to-body>
      <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="到货单号" prop="deliveryNumber">
          <el-input v-model="queryParams.deliveryNumber" placeholder="请输入到货单号" clearable size="small"
            @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="合同编号" prop="purchasingContractNo">
          <el-input v-model="queryParams.purchasingContractNo" placeholder="请输入合同编号" clearable size="small"
            @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="供应商" prop="saleSupplierName">
          <el-input v-model="queryParams.saleSupplierName" placeholder="请输入供应商" clearable size="small"
            @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button  icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="loading" :data="arriveList">
        <el-table-column label="编号" align="center" prop="id"/>
        <el-table-column label="到货单号" align="center" prop="deliveryNumber"/>
        <el-table-column label="合同编号" align="center" prop="purchasingContractNo"/>
        <el-table-column label="供应商名称" align="center" prop="saleSupplierName"/>
        <el-table-column label="联系人" align="center" prop="contacts"/>
        <el-table-column label="联系电话" align="center" prop="contactNumber"/>
        <el-table-column label="到货日期" align="center" prop="arrivalDate"/>
        <el-table-column label="状态" align="center" prop="status">
          <template #default="scope">
            <span>{{status[scope.row.status]}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button size="mini" type="text"  @click="handleSelect(scope.row)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
        @pagination="getList" />
    </el-dialog>
  </template>

<script setup>
import {listArrival} from '@/api/scm/arrival'
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
        default: "选择到货单",
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
    const arriveList = ref([])
    const selectedList = ref([])
    const daterangeReturnDate = ref([])
    const queryParams = ref({
        pageNum: 1,
        pageSize: 10,
        arriveNo: null,
          contractNo: null,
          supplierName: null,
          status: '0', //未入库
    })
    const status = ref(['未入库','入库中','已入库'])
    const handleOpen = async () => {
        getList()
    }
    const handleSelect = async (row) =>  {
        emit('onArriveSelected',row) ;
      }
    const getList = async (paginationParams) => {
        loading.value = true
        if(paginationParams){
            queryParams.value.pageNum = paginationParams.page
            queryParams.value.pageSize = paginationParams.limit
        }
        listArrival(queryParams.value).then(res => {
            arriveList.value = res.rows
            total.value= res.total
            loading.value = false
        })
    }
    const handleQuery = async () => {
        queryParams.value.pageNum = 1
        getList()
    }
    const resetQuery = async () => {
        queryForm.value.resetFields()
        handleQuery()
    }
    const handleSelectionChange =async (selection) => {
        selectedList.value = []
        selectedList.value.push(selection)
        ids.value = selection.map(item => item.id)
        single.value = selection.length !== 1
        multiple.value = !selection.length
    }
    const emit = defineEmits(['update:open','close','fun','onArriveSelected'])
// 关闭对话框逻辑
    const close = () => {
  emit('update:open', false) // 同步关闭状态
  emit('close')              // 触发关闭事件
}
onMounted(() => handleOpen())
</script>