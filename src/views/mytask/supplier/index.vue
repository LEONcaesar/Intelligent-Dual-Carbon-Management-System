<template>
<div class="app-container">
  <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="95px">
    <el-form-item label="供应商名称" prop="supplierName">
      <el-input
          v-model="queryParams.supplierName"
          placeholder="请输入供应商名称"
          clearable
      />
    </el-form-item>
    <el-form-item label="联系人" prop="contacts">
      <el-input
          v-model="queryParams.contacts"
          placeholder="请输入联系人"
          clearable
          @keyup.enter.native="handleQuery"
      />
    </el-form-item>
    <el-form-item label="申请人" prop="applicantId">
      <el-select v-model="queryParams.applicantId" placeholder="请选择申请人" clearable style="width: 240px">
        <el-option
            v-for="dict in userList"
            :key="dict.userId"
            :label="dict.userName"
            :value="dict.userId"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="申请日期">
      <el-date-picker
          v-model="daterangeApplicantDate"
          style="width: 240px"
          value-format="YYYY-MM-DD"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
      ></el-date-picker>
    </el-form-item>
    <el-form-item label="申请状态" prop="applicantStatus">
      <el-select v-model="queryParams.applicantStatus" placeholder="请选择申请状态" clearable style="width: 240px">
        <el-option
            v-for="dict in mytask_apply_status"
            :key="dict.value"
            :label="dict.label"
            :value="parseInt(dict.value)"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="审核人" prop="approvedId">
      <el-select v-model="queryParams.approvedId" placeholder="请选择审核人" clearable style="width: 240px">
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
          v-model="daterangeApprovedDate"
          style="width: 240px"
          value-format="YYYY-MM-DD"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
      ></el-date-picker>
    </el-form-item>
    <el-form-item label="审核状态" prop="approvedStatus">
      <el-select v-model="queryParams.approvedStatus" placeholder="请选择审核状态" clearable style="width: 240px">
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

  <el-table v-loading="loading" :data="procurementPlanList" >
    <el-table-column label="编号" align="center" prop="id" />
    <el-table-column label="供应商名称" align="center" prop="supplierName" />
    <el-table-column label="简称" align="center" prop="abbreviation" />
    <el-table-column label="公司地址" align="center" prop="companyAddress" />
    <el-table-column label="联系人" align="center" prop="contacts" />
    <el-table-column label="联系电话" align="center" prop="contactNumber" />
    <el-table-column label="申请人" align="center" prop="applicantName" />
    <el-table-column label="申请日期" align="center" prop="applicantDate" width="180">
    </el-table-column>
    <el-table-column label="申请状态" align="center" prop="applicantStatus">
      <template #default="scope">
        <dict-tag :options="mytask_apply_status" :value="scope.row.applicantStatus"/>
      </template>
    </el-table-column>
    <el-table-column label="审核人" align="center" prop="approvedName" />
    <el-table-column label="审核日期" align="center" prop="approvedDate" width="180">
    </el-table-column>
    <el-table-column label="审核状态" align="center" prop="approvedStatus">
      <template #default="scope">
        <dict-tag :options="mytask_audit_status" :value="scope.row.approvedStatus"/>
      </template>
    </el-table-column>
    <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
      <template #default="scope">
        <el-button
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
        >
          <el-icon><EditPen /></el-icon>详情
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

  <!-- 添加或修改采购计划审核对话框 -->
  <el-dialog :title="title" v-model="open" width="45%" append-to-body @open="openEmit">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="供应商名称" prop="supplierName">
        <el-input v-model="form.supplierName" placeholder="请输入供应商名称" disabled/>
      </el-form-item>
      <el-form-item label="简称" prop="abbreviation">
        <el-input v-model="form.abbreviation" placeholder="请输入简称" disabled/>
      </el-form-item>
      <el-form-item label="公司地址" prop="address">
        <el-input v-model="form.companyAddress" placeholder="请输入公司地址" disabled/>
      </el-form-item>
      <el-form-item label="联系人" prop="contacts">
        <el-input v-model="form.contacts" placeholder="请输入联系人" disabled/>
      </el-form-item>
      <el-form-item label="联系电话" prop="phone">
        <el-input v-model="form.contactNumber" placeholder="请输入联系电话" disabled/>
      </el-form-item>
      <el-form-item label="申请人" prop="applicantId">
        <el-select v-model="form.applicantId" placeholder="请选择申请人" clearable disabled>
          <el-option
              v-for="dict in userList"
              :key="dict.id"
              :label="dict.userName"
              :value="dict.userId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="申请日期" prop="applicantDate">
        <el-date-picker clearable
                        v-model="form.applicantDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="请选择申请日期"
                        disabled>
        </el-date-picker>
      </el-form-item>
      <el-form-item label="申请状态" prop="applicantStatus">
        <el-select v-model="form.applicantStatus" placeholder="请选择申请状态" disabled>
          <el-option
              v-for="dict in mytask_apply_status"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="审核人" prop="approvedId">
        <el-select v-model="form.approvedId" placeholder="请选择申请人" clearable disabled>
          <el-option
              v-for="dict in userList"
              :key="dict.id"
              :label="dict.userName"
              :value="dict.userId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="审核日期" prop="approvedDate">
        <el-date-picker clearable
                        v-model="form.approvedDate"
                        type="date"
                        value-format="YYYY-MM-DD"
                        disabled
                        placeholder="请选择审核日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="审核状态" prop="auditStatus">
        <el-select v-model="form.approvedStatus" placeholder="请选择审核状态" disabled>
          <el-option
              v-for="dict in mytask_audit_status"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="审核意见" prop="approvedComments">
        <el-input v-model="form.approvedComments" placeholder="请输入审核意见" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button v-if="form.applicantStatus == 1" type="primary" @click="submitForm(1)" >通 过</el-button>
        <el-button v-if="form.applicantStatus == 1" type="primary" @click="submitForm(0)" >驳 回</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</div>
</template>

<script setup>
import { listSupplier, getSupplier, approveSupplier } from '@/api/mytask/supplier.js'
import { getUserList } from '@/api/system/user'
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const { proxy } = getCurrentInstance()
const {
  mytask_apply_status,
  mytask_audit_status
} = proxy.useDict(
    "mytask_apply_status",
    "mytask_audit_status"
)

//========表格渲染========
const loading = ref(false)
const userList = ref([])
const total = ref(0)
const daterangeApplicantDate = ref([])
const daterangeApprovedDate = ref([])
// 表格数据
const procurementPlanList = ref([])
const queryParams = ref({
  pageNum: 1,
  pageSize: 10,
  documentNumber: null,
  applicantId: null,
  applicantStatus: 1,
  approvedId: null,
  approvedStatus: null,
})

const getList = async () => {
  loading.value = true
  const userRes = await getUserList()
  userList.value = userRes.data
  queryParams.value.params = {}
  if (null != daterangeApplicantDate.value && '' != daterangeApplicantDate.value) {
    queryParams.value.params["beginApplicantDate"] = daterangeApplicantDate.value[0]
    queryParams.value.params["endApplicantDate"] = daterangeApplicantDate.value[1]
  }
  if (null != daterangeApprovedDate.value && '' != daterangeApprovedDate.value) {
    queryParams.value.params["beginApprovedDate"] = daterangeApprovedDate.value[0]
    queryParams.value.params["endApprovedDate"] = daterangeApprovedDate.value[1]
  }
  const res = await listSupplier(queryParams.value)
  procurementPlanList.value = res.rows
  total.value = res.total
  loading.value = false
}
onMounted(() => getList())

//====查询表单====
const queryFormRef = ref()
const handleQuery = () => {
  queryParams.value.pageNum = 1
  getList()
}
const resetQuery = () => {
  daterangeApprovedDate.value = []
  daterangeApplicantDate.value = []
  queryFormRef.value.resetFields()
  handleQuery()
}

//====弹层====
const open = ref(false)
const title = ref('')
let form = ref({})
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
  const id = row.id
  const res = await getSupplier(id)
  form.value = res.data
  open.value = true
  title.value = '供应商审核详情'
}
const submitForm = async (status) => {
  form.value.approvedStatus = status
  await approveSupplier(form.value)
  ElMessage.success('审核成功')
  open.value = false
  await getList()
}
const cancel = () => {
  open.value = false
  reset()
}
</script>
