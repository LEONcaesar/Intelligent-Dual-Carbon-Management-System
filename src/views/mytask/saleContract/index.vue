<template>
    <div class="app-container">
      <el-form :model="queryParams" ref="queryForm" size="default" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="订单编号" prop="orderNo">
          <el-input
            v-model="queryParams.orderNo"
            placeholder="请输入订单编号"
            clearable
          />
        </el-form-item>
        <el-form-item label="签订日期" prop="daterangeSigningDate">
          <el-date-picker
            v-model="daterangeSigningDate"
            style="width: 240px"
            value-format="YYYY-MM-DD"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="业务员" prop="salesManId">
          <el-select v-model="queryParams.salesManId" placeholder="请选择业务员" clearable style="width: 200px;">
            <el-option
              v-for="user in salesManList"
              :key="user.userId"
              :label="user.userName"
              :value="user.userId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="客户名称" prop="customId">
          <el-select v-model="queryParams.customId" placeholder="请选择客户" clearable style="width: 200px;">
            <el-option
              v-for="user in customList"
              :key="user.id"
              :label="user.customName"
              :value="user.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="交货日期" prop="deliveryDate">
          <el-date-picker clearable
                          v-model="queryParams.deliveryDate"
                          type="date"
                          value-format="YYYY-MM-DD"
                          placeholder="请选择交货日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="申请人" prop="applyId">
          <el-select v-model="queryParams.applyId" placeholder="请选择申请人" clearable style="width: 200px;">
            <el-option
              v-for="dict in userList"
              :key="dict.id"
              :label="dict.userName"
              :value="dict.userId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="申请日期">
          <el-date-picker
            v-model="daterangeApplyDate"
            style="width: 240px"
            value-format="YYYY-MM-DD"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="申请状态" prop="applyStatus">
          <el-select v-model="queryParams.applyStatus" placeholder="请选择申请状态" clearable style="width: 200px;">
            <el-option
              v-for="dict in mytask_apply_status"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核人">
          <el-select v-model="queryParams.auditorId" placeholder="请选择审核人" clearable style="width: 200px;">
            <el-option
              v-for="dict in userList"
              :key="dict.id"
              :label="dict.userName"
              :value="dict.userId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="审核日期">
          <el-date-picker
            v-model="daterangeAuditDate"
            style="width: 240px"
            value-format="YYYY-MM-DD"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="审核状态" prop="auditorStatus">
          <el-select v-model="queryParams.auditStatus" placeholder="请选择审核状态" clearable style="width: 200px;">
            <el-option
              v-for="dict in mytask_audit_status"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="default" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="default" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
  
      <el-table v-loading="loading" :data="procurementPlanList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="编号" align="center" prop="id" />
        <el-table-column label="合同编号" align="center" prop="contractNumber" width="180"/>
        <el-table-column label="订单编号" align="center" prop="orderNo" width="180"/>
        <el-table-column label="客户名称" align="center" prop="customName" width="180" />
        <el-table-column label="业务员" align="center" prop="salesMan" />
        <el-table-column label="交货日期" align="center" prop="deliveryDate" width="180">
        </el-table-column>
        <el-table-column label="送货方式" align="center" prop="shipping">
          <template #default="scope">
            <dict-tag :options="scm_shipping_type" :value="scope.row.shipping" />
          </template>
        </el-table-column>
        <el-table-column label="金额合计" align="center" prop="totalAmount" />
        <el-table-column label="签订日期" align="center" prop="signingDate" width="180">
        </el-table-column>
        <el-table-column label="申请人" align="center" prop="applyName" />
        <el-table-column label="申请日期" align="center" prop="applyDate" width="180">
        </el-table-column>
        <el-table-column label="申请状态" align="center" prop="applyStatus">
          <template #default="scope">
            <dict-tag :options="mytask_apply_status" :value="scope.row.applyStatus"/>
          </template>
        </el-table-column>
        <el-table-column label="审核人" align="center" prop="auditorName" />
        <el-table-column label="审核日期" align="center" prop="auditTime" width="180">
        </el-table-column>
        <el-table-column label="审核状态" align="center" prop="auditStatus">
          <template #default="scope">
            <dict-tag :options="mytask_audit_status" :value="scope.row.auditStatus"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="default-padding fixed-width">
          <template #default="scope">
            <el-button
              size="default"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
            >详情</el-button>
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
  
      <!-- 添加或修改采购计划审核对话框 -->
      <el-dialog :title="title" v-model="open" width="45%" append-to-body>
        <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
          <el-form-item label="订单编号" prop="orderNo">
            <el-input placeholder="请选择" v-model="form.orderNo" class="input-with-select" :disabled="true" />
          </el-form-item>
          <el-form-item label="送货方式" prop="shipping">
            <el-select v-model="form.shipping" placeholder="请选择送货方式" :disabled="true">
              <el-option
                v-for="dict in scm_shipping_type"
                :key="dict.value"
                :label="dict.label"
                :value="parseInt(dict.value)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="签订日期" prop="signingDate">
            <el-date-picker clearable
                            v-model="form.signingDate"
                            type="date"
                            :disabled="true"
                            value-format="YYYY-MM-DD"
                            placeholder="请选择签订日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="客户名称" prop="customName">
            <el-input v-model="form.customName" placeholder="请输入客户名称"  :disabled="true"/>
          </el-form-item>
          <el-form-item label="金额合计" prop="totalAmount">
            <el-input v-model="form.totalAmount" placeholder="请输入金额合计"  :disabled="true"/>
          </el-form-item>
          <el-form-item label="交货日期" prop="deliveryDate">
            <el-date-picker clearable
                            v-model="form.deliveryDate"
                            type="date"
                            value-format="YYYY-MM-DD"
                            placeholder="请选择交货日期"
                            :disabled="true">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="申请人" prop="applyId">
            <el-select v-model="form.applyId" placeholder="请选择申请人" clearable disabled>
              <el-option
                v-for="dict in userList"
                :key="dict.id"
                :label="dict.userName"
                :value="dict.userId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="申请日期" prop="applyDate">
            <el-date-picker clearable
              v-model="form.applyDate"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="请选择申请日期"
              disabled>
            </el-date-picker>
          </el-form-item>
          <el-form-item label="申请状态" prop="applyStatus">
            <el-select v-model="form.applyStatus" placeholder="请选择申请状态" disabled>
              <el-option
                v-for="dict in mytask_apply_status"
                :key="dict.value"
                :label="dict.label"
                :value="parseInt(dict.value)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="审核人" prop="auditorId">
            <el-select v-model="form.auditorId" placeholder="请选择审核人" clearable disabled>
              <el-option
                v-for="dict in userList"
                :key="dict.id"
                :label="dict.userName"
                :value="dict.userId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="审核日期" prop="auditTime">
            <el-date-picker clearable
              v-model="form.auditTime"
              type="date"
              value-format="YYYY-MM-DD"
              disabled
              placeholder="请选择审核日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="审核状态" prop="auditStatus">
            <el-select v-model="form.auditStatus" placeholder="请选择审核状态" disabled>
              <el-option
                v-for="dict in mytask_audit_status"
                :key="dict.value"
                :label="dict.label"
                :value="parseInt(dict.value)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="审核意见" prop="auditorComments">
            <el-input v-model="form.auditorComments" placeholder="请输入审核意见" />
          </el-form-item>
          <el-divider content-position="center">采购计划详细信息</el-divider>
          <el-table :data="form.scmSaleContractItemList" :row-class-name="rowScmSaleOrderItemIndex"
                    @selection-change="handleScmSaleOrderItemSelectionChange" ref="scmSaleOrderItem">
            <el-table-column label="序号" align="center" prop="index" width="50"/>
            <el-table-column label="产品" prop="model" width="150">
              <template #default="scope">
                {{scope.row.materialName}}
                <el-button
                  size="default"
                  type="text"
                  @click="selectMaterial(scope.row)"
                >选择
                </el-button>
              </template>
            </el-table-column>
            <el-table-column label="型号" prop="model" width="150">
              <template #default="scope">
                <el-input v-model="scope.row.materialModel" placeholder="请输入型号" disabled />
              </template>
            </el-table-column>
            <el-table-column label="规格" prop="specification" width="150">
              <template #default="scope">
                <el-input v-model="scope.row.materialSpecifications" placeholder="请输入规格" disabled />
              </template>
            </el-table-column>
            <el-table-column label="单位" prop="unit" width="150">
              <template #default="scope">
                <el-input v-model="scope.row.materialUnit" placeholder="请输入单位" disabled />
              </template>
            </el-table-column>
            <el-table-column label="单价" prop="unitPrice" width="150">
              <template #default="scope">
                <el-input v-model="scope.row.materialPrice" placeholder="请输入单价" disabled />
              </template>
            </el-table-column>
            <el-table-column label="订货数量" prop="orderQuantity" width="150">
              <template #default="scope">
                <el-input v-model="scope.row.orderQuantity" placeholder="请输入订货数量" disabled />
              </template>
            </el-table-column>
            <el-table-column label="金额" prop="amount" width="150">
              <template #default="scope">
                <el-input v-model="scope.row.amount" placeholder="请输入金额" disabled />
              </template>
            </el-table-column>
            <el-table-column label="备注" prop="note" width="150">
              <template #default="scope">
                <el-input v-model="scope.row.remark" placeholder="请输入备注" disabled />
              </template>
            </el-table-column>
          </el-table>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button v-if="form.applyStatus==1" type="primary" @click="submitForm(1)">通 过</el-button>
          <el-button v-if="form.applyStatus==1" type="primary" @click="submitForm(0)">驳 回</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </template>

  <script setup>
import {getContract, updateContract, listContract, approveContract} from "@/api/scm/saleContract";
import {getUserList} from "@/api/system/user";
import {listCustomList} from "@/api/scm/custom";
import { ElMessage } from "element-plus";
import {ref,onMounted,getCurrentInstance} from 'vue'
const {proxy} = getCurrentInstance()
const {
    mytask_audit_status,
    mytask_apply_status,
    scm_shipping_type
} = proxy.useDict(
    "mytask_audit_status",
    "mytask_apply_status",
    "scm_shipping_type"
)
const loading = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const showSearch = ref(true)
const total = ref(0)
const procurementPlanList = ref([])
const title = ref("")
const open = ref(false)
const daterangeApplyDate = ref([])
const daterangeAuditDate = ref([])
const daterangeSigningDate = ref([])
const formRef = ref(null)
const queryForm = ref(null)
const queryParams = ref({
    pageNum:1,
    pageSize:10,
    orderNo: null,
    customId: null,
    salesManId: null,
    applyId: null,
    applyStatus: null,
    auditorId: null,
    auditStatus: null

})
const form = ref({})
const userList = ref([])
const customList = ref([])
const salesManList = ref([])
const getList = async (paginationParams) => {
    loading.value = true
    if(paginationParams){
          queryParams.value.pageNum = paginationParams.page
          queryParams.value.pageSize = paginationParams.limit
        }
    queryParams.value.params ={}
    if(daterangeApplyDate && daterangeApplyDate === 2){
        queryParams.value.params.beginApplicantDate = daterangeApplyDate.value[0]
        queryParams.value.params.endApplicantDate = daterangeApplyDate.value[1]

    }
    if(daterangeAuditDate && daterangeAuditDate === 2){
        queryParams.value.params.beginAuditDate = daterangeAuditDate.value[0]
        queryParams.value.params.endAuditDate = daterangeAuditDate.value[1]

    }
    if(daterangeSigningDate && daterangeSigningDate === 2){
        queryParams.value.params.beginSigningDate = daterangeSigningDate.value[0]
        queryParams.value.params.beginSigningDate = daterangeSigningDate.value[1]

    }
    
    getUserList().then(res => {
        userList.value = res.data
        salesManList.value = res.data
    })
    listCustomList().then(res => {
        customList.value = res.data
    })
    listContract(queryParams.value).then(res => {
        procurementPlanList.value = res.rows
        total.value = res.total
        loading.value = false
    })
}
const cancel = async () => {
    open.value = false
    reset()
}
const reset = async () => {
    form.value={
        id: null,
        orderNo: null,
        shipping: null,
        signingDate: null,
        customName: null,
        totalAmount: null,
        deliveryDate: null,
        applyId: null,
        applyDate: null,
        applyStatus: null,
        auditorId: null,
        auditTime: null,
        auditStatus: null,
        auditorComments: null,
        
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
    daterangeSigningDate.value = []
    daterangeApplyDate.value = []
    daterangeAuditDate.value = []
    queryForm.value.resetFields()
    handleQuery()
}
const handleSelectionChange = async (selection) => {
    ids.value = selection.map(item => item.id)
    single.value = selection.length !==1
    multiple.value = !selection.length
}
const handleUpdate = async (row) => {
    reset()
    const id = row.id || ids.value[0]
    getContract(id).then(res => {
        form.value = res.data
        open.value = true
        title.value = "销售合同审核详细"
    })
}
const submitForm = async (status) => {
    form.value.auditStatus = status
    approveContract(form.value).then(res => {
        ElMessage.success("审核成功")
        open.value = false
        getList
    })
}
const rowScmSaleOrderItemIndex = async ({row,rowIndex}) => {
    row.index = rowIndex + 1
}
const handleScmSaleOrderItemSelectionChange = async (selection) => {
    checkedScmSaleOrderItem.value = selection.map(item => item.index)
}
onMounted(() => getList())

</script>
  