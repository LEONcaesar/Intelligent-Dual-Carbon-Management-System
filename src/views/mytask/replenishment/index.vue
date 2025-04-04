<template>
    <div class="app-container">
  
      <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
        <el-form-item label="单据号" prop="documentNumber">
          <el-input
              v-model="queryParams.documentNumber"
              placeholder="请输入单据号"
              clearable
              @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="申请人" prop="applicant">
          <el-select v-model="queryParams.applicant" placeholder="请选择申请人" clearable style="width: 240px">
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
              v-model="daterangeApplicationDate"
              style="width: 240px"
              value-format="YYYY-MM-DD"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="申请状态" prop="applicationStatus">
          <el-select v-model="queryParams.applicationStatus" placeholder="请选择申请状态" clearable style="width: 240px">
            <el-option
                v-for="dict in wms_replenishment_application_application_status"
                :key="dict.value"
                :label="dict.label"
                :value="parseInt(dict.value)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="审核人" prop="approved">
          <el-select v-model="queryParams.approved" placeholder="请选择审核人" clearable style="width: 240px">
            <el-option
                v-for="dict in userList"
                :key="dict.userId"
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
                v-for="dict in wms_replenishment_application_approved_status"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery"><el-icon><Search /></el-icon>搜素</el-button>
          <el-button @click="resetQuery"><el-icon><Refresh /></el-icon>重置</el-button>
        </el-form-item>
      </el-form>
  
      <el-table v-loading="loading" :data="replenishmentApplicationList">
        <el-table-column label="编号" align="center" prop="id" />
        <el-table-column label="单据号" align="center" prop="documentNumber" />
        <el-table-column label="状态" align="center" prop="status">
          <template #default="scope">
            <dict-tag :options="wms_replenishment_application_status" :value="scope.row.status"/>
          </template>
        </el-table-column>
        <el-table-column label="申请人" align="center" prop="applicantName" />
        <el-table-column label="申请日期" align="center" prop="applicationDate" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.applicationDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="申请状态" align="center" prop="applicationStatus">
          <template #default="scope">
            <dict-tag :options="wms_replenishment_application_application_status" :value="scope.row.applicationStatus"/>
          </template>
        </el-table-column>
        <el-table-column label="审核人" align="center" prop="approvedName" />
        <el-table-column label="审核日期" align="center" prop="approvedDate" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.approvedDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="审核状态" align="center" prop="approvedStatus">
          <template #default="scope">
            <dict-tag :options="wms_replenishment_application_approved_status" :value="scope.row.approvedStatus"/>
          </template>
        </el-table-column>
        <!-- <el-table-column label="备注" align="center" prop="remark" /> -->
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button
                size="default"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
            ><el-icon><EditPen /></el-icon>详情</el-button>
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
  
      <!-- 添加或修改智能仓储WMS-补货申请对话框 -->
      <el-dialog :title="title" v-model="open" width="600px" append-to-body>
        <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
          <el-form-item label="单据号" prop="documentNumber">
            <el-input v-model="form.documentNumber" placeholder="请输入单据号" disabled/>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="form.status" placeholder="请选择状态" disabled>
              <el-option
                  v-for="dict in wms_replenishment_application_status"
                  :key="dict.value"
                  :label="dict.label"
                  :value="parseInt(dict.value)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="申请人" prop="applicant">
            <el-select v-model="form.applicant" placeholder="请选择申请人" disabled>
              <el-option
                  v-for="dict in userList"
                  :key="dict.userId"
                  :label="dict.userName"
                  :value="dict.userId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="申请日期" prop="applicationDate">
            <el-date-picker clearable disabled
                            v-model="form.applicationDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="请选择申请日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="申请状态" prop="applicationStatus">
            <el-select v-model="form.applicationStatus" placeholder="请选择申请状态" disabled>
              <el-option
                  v-for="dict in wms_replenishment_application_application_status"
                  :key="dict.value"
                  :label="dict.label"
                  :value="parseInt(dict.value)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="审核人" prop="approved">
            <el-select v-model="form.approved" placeholder="请选择审核人" disabled>
              <el-option
                  v-for="dict in userList"
                  :key="dict.userId"
                  :label="dict.userName"
                  :value="dict.userId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="审核日期" prop="approvedDate">
            <el-date-picker clearable disabled
                            v-model="form.approvedDate"
                            type="date"
                            value-format="YYYY-MM-DD"
                            placeholder="请选择审核日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="审核状态" prop="approvedStatus">
            <el-select v-model="form.approvedStatus" placeholder="请选择审核状态" disabled>
              <el-option
                  v-for="dict in wms_replenishment_application_approved_status"
                  :key="dict.value"
                  :label="dict.label"
                  :value="parseInt(dict.value)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="审核意见" prop="approvedComments">
            <el-input v-model="form.approvedComments" placeholder="请输入审核意见" />
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" placeholder="请输入备注" disabled/>
          </el-form-item>
          <el-divider content-position="center">补货申请明细信息</el-divider>
          <el-table :data="wmsReplenishmentApplicationDetailsList" :row-class-name="rowWmsReplenishmentApplicationDetailsIndex" ref="wmsReplenishmentApplicationDetails">
            <el-table-column label="序号" align="center" prop="index" width="50"/>
            <el-table-column label="物料" prop="materialId" width="150">
              <template #default="scope">
                <el-select v-model="scope.row.materialId" placeholder="请选择物料" disabled>
                  <el-option
                      v-for="dict in materialList"
                      :key="dict.id"
                      :label="dict.materialName"
                      :value="dict.id"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="补货数量" prop="replenishmentNumber" width="150">
              <template #default="scope">
                <el-input v-model="scope.row.replenishmentNumber" placeholder="请输入补货数量" disabled />
              </template>
            </el-table-column>
            <el-table-column label="备注" prop="remark" width="150">
              <template #default="scope">
                <el-input v-model="scope.row.remark" placeholder="请输入备注" disabled />
              </template>
            </el-table-column>
          </el-table>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button v-if="form.applicationStatus==1" type="success" @click="submitForm(1)">通 过</el-button>
            <el-button v-if="form.applicationStatus==1" type="primary" @click="submitForm(0)">驳 回</el-button>
            <el-button @click="cancel">取 消</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </template>

<script setup>
import {
  getReplenishmentApplication,
  listUser,
  listMaterial,
  approveReplenishmentApplication,
  listReplenishmentApplication
} from '@/api/mytask/replenishmentApplication.js'
import {ref,onMounted,getCurrentInstance} from 'vue'
import Pagination from '@/components/Pagination'
import {ElMessage,ElMessageBox} from 'element-plus'

const {proxy} = getCurrentInstance()
const {
    wms_replenishment_application_approved_status,
  wms_replenishment_application_application_status,
  wms_replenishment_application_status,
} = proxy.useDict(
    "wms_replenishment_application_approved_status",
    "wms_replenishment_application_application_status",
    "wms_replenishment_application_status",
)
const loading = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const showSearch = ref(true)
const total = ref(0)
const replenishmentApplicationList  = ref([])
const wmsReplenishmentApplicationDetailsList  = ref([])
const title = ref("")
const open = ref(false)
const form = ref({})
const queryForm = ref(null)
const formRef = ref(null)
const userList = ref([])
const materialList  = ref([])
const daterangeApplicationDate = ref([])
const daterangeApprovedDate = ref([])

const queryParams = ref({
    pageNum: 1,
  pageSize: 10,
  documentNumber: null,
  applicationDate: null,
  applicationStatus: 1,
  approvedDate: null,
  approvedStatus: null,
  applicant: null,
  approved: null
})


const getList = async (paginationParams) => {
    loading.value = true
    queryParams.params = {}
    if(paginationParams){
        queryParams.value.pageNum = paginationParams.page
        queryParams.value.pageSize=paginationParams.limit
    }
    if(daterangeApplicationDate && daterangeApplicationDate === 2 ){
        queryParams.value.params.beginApplicationDate = daterangeApplicationDate.value[0]
        queryParams.value.params.endApplicationDate = daterangeApplicationDate.value[1]

    }
    if(daterangeApprovedDate && daterangeApprovedDate === 2 ){
        queryParams.value.params.beginApprovedDate = daterangeApprovedDate.value[0]
        queryParams.value.params.endApprovedDate = daterangeApprovedDate.value[1]

    }
    listUser().then(res => {
        userList.value=res.data
    })
    
    listMaterial().then(res => {
        materialList.value = res.data
    })
    listReplenishmentApplication(queryParams.value).then(res => {
        replenishmentApplicationList.value = res.rows
        total.value = res.total
        loading.value = false
    })
}
const cancel = async () => {
    open.value=false
    reset()
}
const reset =async () => {
    form.value={
        id: null,
    documentNumber: null,
    status: null,
    applicant: null,
    applicationDate: null,
    applicationStatus: null,
    approved: null,
    approvedDate: null,
    approvedStatus: null,
    approvedComments: null,
    remark: null
    }
    wmsReplenishmentApplicationDetailsList.value = []
    if(formRef.value){
        formRef.value.resetFields()
    }
}
const handleQuery = async () => {
    queryParams.value.pageNum = 1
    await getList()
}
const resetQuery = async () => {
    daterangeApplicationDate.value = []
    daterangeApprovedDate.value = []
    queryForm.value.resetFields()
    handleQuery()
}
const handleSelectionChange = async (selection) => {
    ids.value = selection.map(item => item.id)
    single.value = selection.length !=1
    multiple.value = !selection.length
}
const handleUpdate = async (row) => {
    reset()
    const id = row.id || ids.value[0]
    getReplenishmentApplication(id).then(res => {
        form.value = res.data
        wmsReplenishmentApplicationDetailsList.value = res.data.wmsReplenishmentApplicationDetailsList
        open.value = true
        title.value="补库申请审核 "

    })
}
const submitForm = async (status) => {
    form.wmsReplenishmentApplicationDetailsList = wmsReplenishmentApplicationDetailsList.value
    form.approvedStatus = status
    approveReplenishmentApplication(form.value).then(res => {
        ElMessage.success("审核成功")
        open.value = false
        getList()
    })
}
onMounted(() => getList())
</script>