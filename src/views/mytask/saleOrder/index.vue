<template>
<div class="app-container">
  <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
    <el-form-item label="订单编号" prop="orderNo">
      <el-input
          v-model="queryParams.orderNo"
          placeholder="请输入销售编号"
          clearable
          @keyup.enter.native="handleQuery"
      />
    </el-form-item>
    <el-form-item label="客户名称" prop="customId">
      <el-select v-model="queryParams.customId" placeholder="请选择客户" clearable style="width: 240px">
        <el-option
            v-for="user in customList"
            :key="user.id"
            :label="user.customName"
            :value="user.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="申请人" prop="applyId">
      <el-select v-model="queryParams.applyId" placeholder="请选择申请人" clearable style="width: 240px">
        <el-option
            v-for="dict in userList"
            :key="dict.userId"
            :label="dict.userName"
            :value="dict.userId"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="申请时间">
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
      <el-select v-model="queryParams.applyStatus" placeholder="请选择申请状态" clearable style="width: 240px">
        <el-option
            v-for="dict in mytask_apply_status"
            :key="dict.value"
            :label="dict.label"
            :value="parseInt(dict.value)"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="审核人" prop="auditorId">
      <el-select v-model="queryParams.auditorId" placeholder="请选择审核人" clearable style="width: 240px">
        <el-option
            v-for="dict in userList"
            :key="dict.userId"
            :label="dict.userName"
            :value="dict.userId"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="审核时间">
      <el-date-picker
          v-model="daterangeAuditTime"
          style="width: 240px"
          value-format="YYYY-MM-DD"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
      ></el-date-picker>
    </el-form-item>
    <el-form-item label="审核状态" prop="auditStatus">
      <el-select v-model="queryParams.auditStatus" placeholder="请选择审核状态" clearable style="width: 240px">
        <el-option
            v-for="dict in mytask_audit_status"
            :key="dict.value"
            :label="dict.label"
            :value="parseInt(dict.value)"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleQuery"><el-icon><Search /></el-icon>搜素</el-button>
      <el-button @click="resetQuery"><el-icon><Refresh /></el-icon>重置</el-button>
    </el-form-item>
  </el-form>

  <el-table v-loading="loading" :data="orderList">
    <el-table-column label="编号" align="center" prop="id"/>
    <el-table-column label="订单编号" align="center" prop="orderNo" width="180"/>
    <el-table-column label="客户名称" align="center" prop="customName"/>
    <el-table-column label="金额合计" align="center" prop="totalAmount"/>
    <el-table-column label="交货日期" align="center" prop="deliveryDate" width="180">
      <template #default="scope">
        <span>{{ parseTime(scope.row.deliveryDate, '{y}-{m}-{d}') }}</span>
      </template>
    </el-table-column>
    <el-table-column label="申请人" align="center" prop="applyName"/>
    <el-table-column label="申请时间" align="center" prop="applyDate" width="180">
      <template #default="scope">
        <span>{{ parseTime(scope.row.applyDate, '{y}-{m}-{d}') }}</span>
      </template>
    </el-table-column>
    <el-table-column label="申请状态" align="center" prop="applyStatus">
      <template #default="scope">
        <dict-tag :options="mytask_apply_status" :value="scope.row.applyStatus"/>
      </template>
    </el-table-column>
    <el-table-column label="审核人" align="center" prop="auditorName"/>
    <el-table-column label="审核时间" align="center" prop="auditTime" width="180">
      <template #default="scope">
        <span>{{ parseTime(scope.row.auditTime, '{y}-{m}-{d}') }}</span>
      </template>
    </el-table-column>
    <el-table-column label="审核状态" align="center" prop="auditStatus">
      <template #default="scope">
        <dict-tag :options="mytask_audit_status" :value="scope.row.auditStatus"/>
      </template>
    </el-table-column>
    <el-table-column label="操作" align="center" class-name="default-padding fixed-width">
      <template #default="scope">
        <el-button
            type="text"
            @click="handleUpdate(scope.row)"
        >详情
        </el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-pagination
      v-show="total > 0"
      layout="->, total, sizes, prev, pager, next, jumper"
      v-model:current-page="queryParams.pageNum"
      v-model:page-size="queryParams.pageSize"
      :page-sizes="[10, 20, 30, 50]"
      background
      :total="total"
      @size-change="getList"
      @current-change="getList"
  />

  <el-dialog :title="title" v-model="open" width="800px" append-to-body @open="openEmit">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="销售编号" prop="orderNo">
        <el-input v-model="form.orderNo" placeholder="请输入销售编号" :disabled="true" />
      </el-form-item>
      <el-form-item label="联系人" prop="linkman">
        <el-input v-model="form.linkman" placeholder="请输入联系人" :disabled="true"/>
      </el-form-item>
      <el-form-item label="联系方式" prop="contactWay">
        <el-input v-model="form.linkmanPhoneNumber" placeholder="请输入联系方式" :disabled="true"/>
      </el-form-item>
      <el-form-item label="金额合计" prop="totalAmount">
        <el-input v-model="form.totalAmount" placeholder="请输入金额合计" :disabled="true"/>
      </el-form-item>
      <el-form-item label="交货日期" prop="deliveryDate">
        <el-date-picker clearable
                        v-model="form.deliveryDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        :disabled="true"
                        placeholder="请选择交货日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="申请人" prop="applyId">
        <el-select v-model="form.applyId" placeholder="请选择申请人" clearable :disabled="true">
          <el-option
              v-for="dict in userList"
              :key="dict.userId"
              :label="dict.userName"
              :value="dict.userId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="申请时间" prop="applyDate">
        <el-date-picker clearable
                        v-model="form.applyDate"
                        type="date"
                        :disabled="true"
                        value-format="YYYY-MM-DD"
                        placeholder="请选择申请时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="申请状态" prop="applyStatus">
        <el-select v-model="form.applyStatus" placeholder="请选择申请状态" :disabled="true">
          <el-option
              v-for="dict in mytask_apply_status"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="审核人" prop="auditorId">
        <el-select v-model="form.auditorId" placeholder="请选择审核人" clearable :disabled="true">
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
                        :disabled="true"
                        placeholder="请选择审核日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="审核状态" prop="auditStatus">
        <el-select v-model="form.auditStatus" placeholder="请选择审核状态" :disabled="true">
          <el-option
              v-for="dict in mytask_audit_status"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="审核意见" prop="remark">
        <el-input v-model="form.remark" placeholder="请输入审核意见"/>
      </el-form-item>

      <el-table :data="form.scmSaleOrderItemList" ref="scmSaleOrderItem">
        <el-table-column label="序号" align="center" prop="id" width="50"/>
        <el-table-column label="产品" prop="model" width="150" :disabled="true">
          <template #default="scope">{{scope.row.materialName}}</template>
        </el-table-column>
        <el-table-column label="型号" prop="materialModel" width="150">
          <template #default="scope">
            <el-input v-model="scope.row.materialModel" placeholder="请输入型号" :disabled="true"/>
          </template>
        </el-table-column>
        <el-table-column label="规格" prop="materialSpecifications" width="150">
          <template #default="scope">
            <el-input v-model="scope.row.materialSpecifications" placeholder="请输入规格" :disabled="true"/>
          </template>
        </el-table-column>
        <el-table-column label="单位" prop="materialUnit" width="150">
          <template #default="scope">
            <el-input v-model="scope.row.materialUnit" placeholder="请输入单位" :disabled="true"/>
          </template>
        </el-table-column>
        <el-table-column label="单价" prop="materialPrice" width="150">
          <template #default="scope">
            <el-input v-model="scope.row.materialPrice" placeholder="请输入单价" :disabled="true"/>
          </template>
        </el-table-column>
        <el-table-column label="订货数量" prop="quantity" width="150">
          <template #default="scope">
            <el-input-number :min="1"v-model="scope.row.quantity" size="default" :disabled="true" placeholder="请输入订货数量"/>
          </template>
        </el-table-column>
        <el-table-column label="金额" prop="amount" width="150">
          <template #default="scope">
            <el-input-number :min="0" v-model="scope.row.amount" size="default" :disabled="true" placeholder="请输入金额"/>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="note" width="150">
          <template #default="scope">
            <el-input v-model="scope.row.note" placeholder="请输入备注"/>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button v-if="form.applyStatus===1" type="primary" @click="submitForm(1)">通 过</el-button>
        <el-button v-if="form.applyStatus===1" type="primary" @click="submitForm(0)">驳 回</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</div>
</template>

<script setup>
import { listOrder, listCustomList, getOrder, approveOrder } from '@/api/mytask/saleOrder.js'
import { getUserList } from '@/api/system/user'
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const { proxy } = getCurrentInstance()
const {
  mytask_apply_status,
  mytask_audit_status,
} = proxy.useDict(
    "mytask_apply_status",
    "mytask_audit_status",
)

const loading = ref(true)
const userList = ref([])
const customList = ref([])
const daterangeDeliveryDate = ref([])
const daterangeApplyDate = ref([])
const daterangeAuditTime = ref([])
const total = ref(0)
const orderList = ref([])
const queryParams = ref({
  pageNum: 1,
  pageSize: 10,
  orderNo: null,
  customName: null,
  deliveryDate: null,
  apply: null,
  applyDate: null,
  applyStatus: 1,
  auditor: null,
  auditTime: null,
  auditStatus: null,
})

const getList = async () => {
  loading.value = true
  const customRes = await listCustomList()
  customList.value = customRes.data
  const userRes = await getUserList()
  userList.value = userRes.data
  queryParams.value.params = {}
  if (null != daterangeDeliveryDate.value && '' != daterangeDeliveryDate.value) {
    queryParams.value.params["beginDeliveryDate"] = daterangeDeliveryDate.value[0]
    queryParams.value.params["endDeliveryDate"] = daterangeDeliveryDate.value[1]
  }
  if (null != daterangeApplyDate.value && '' != daterangeApplyDate.value) {
    queryParams.value.params["beginApplyDate"] = daterangeApplyDate.value[0]
    queryParams.value.params["endApplyDate"] = daterangeApplyDate.value[1]
  }
  if (null != daterangeAuditTime.value && '' != daterangeAuditTime.value) {
    console.log(1)
    queryParams.value.params["beginAuditTime"] = daterangeAuditTime.value[0]
    queryParams.value.params["endAuditTime"] = daterangeAuditTime.value[1]
  }
  const response = await listOrder(queryParams.value)
  orderList.value = response.rows
  total.value = response.total
  loading.value = false
}
onMounted(() => getList())

const queryFormRef = ref()

const handleQuery = () => {
  queryParams.value.pageNum = 1
  getList()
}
const resetQuery = () => {
  daterangeDeliveryDate.value = []
  daterangeApplyDate.value = []
  daterangeAuditTime.value = []
  queryFormRef.value.resetFields()
  handleQuery()
}

const title = ref('')
const open = ref(false)
const form = ref()
const formRef = ref()
const rules = ref()

const openEmit = () => {
  formRef.value.resetFields()
}
const reset = () => {
  form.value = {}
}
const handleUpdate = async (row) => {
  reset()
  open.value = true
  const id = row.id
  const response = await getOrder(id)
  form.value = response.data
  title.value = '审核销售订单'
}
const submitForm = async (status) => {
  form.value.auditStatus = status
  await approveOrder(form.value)
  ElMessage.success('审核成功')
  open.value = false
  await getList()
}
const cancel = () => {
  open.value = false
  reset()
}
</script>