<template>
    <div class="app-container">
      <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="90px">
        <el-form-item label="申请单号" prop="documentNo">
          <el-input v-model="queryParams.documentNo" placeholder="请输入申请单号" clearable size="default"
                    @keyup.enter.native="handleQuery"/>
        </el-form-item>
        <el-form-item label="业务类型" prop="businessType" >
          <el-select v-model="queryParams.businessType" placeholder="请选择业务类型" clearable style="width:150px">
            <el-option
              v-for="dict in  wms_application_business"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="供应商" prop="supplierId">
          <el-select v-model="queryParams.supplierId" placeholder="请选择供应商" clearable size="default" style="width:150px">
            <el-option
              v-for="item in supplierList"
              :key="item.id"
              :label="item.supplierName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="合同类型" prop="contractType">
          <el-select v-model="queryParams.contractType" placeholder="请选择合同类型" clearable style="width:150px">
            <el-option
              v-for="dict in  wms_application_contract"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="入库状态" prop="documentStatus">
          <el-select v-model="queryParams.documentStatus" placeholder="请选择入库状态" clearable style="width:150px">
            <el-option
              v-for="dict in  wms_application_status1"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="申请人" prop="applicant">
          <el-select v-model="queryParams.applicant" placeholder="请选择申请人" clearable style="width:150px">
            <el-option
              v-for="dict in userList"
              :key="dict.userId"
              :label="dict.userName"
              :value="dict.userId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="申请日期" prop="applicationDate">
          <el-date-picker
            v-model="daterangeApplicationDate"
            style="width: 240px"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="申请状态" prop="applicationStatus">
          <el-select v-model="queryParams.applicationStatus" placeholder="请选择申请状态" clearable style="width:150px">
            <el-option
              v-for="dict in  wms_application_status"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="审核人" prop="approved">
          <el-select v-model="queryParams.approved" placeholder="请选择审核人" clearable style="width:150px">
            <el-option
              v-for="dict in userList"
              :key="dict.userId"
              :label="dict.userName"
              :value="dict.userId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="审核日期" prop="approvedDate">
          <el-date-picker
            v-model="daterangeApprovedDate"
            style="width: 240px"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="审核状态" prop="approvedStatus">
          <el-select v-model="queryParams.approvedStatus" placeholder="请选择审核状态" clearable style="width:150px">
            <el-option
              v-for="dict in  wms_approved_status"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="default" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="default" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="loading" :data="warehousingApplicationList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column label="编号" align="center" prop="id"/>
        <el-table-column label="申请单号" align="center" prop="documentNo"/>
        <el-table-column label="关联单据号" align="center" prop="associationDocumentNo" width="150"/>
        <el-table-column label="业务类型" align="center" prop="businessType">
          <template #default="scope">
            <dict-tag :options="wms_application_business" :value="scope.row.businessType"/>
          </template>
        </el-table-column>
        <el-table-column label="供应商" align="center" prop="supplierName"/>
        <el-table-column label="合同号" align="center" prop="contractNo"/>
        <el-table-column label="合同类型" align="center" prop="contractType">
          <template #default="scope">
            <dict-tag :options="wms_application_contract" :value="scope.row.contractType"/>
          </template>
        </el-table-column>
        <el-table-column label="单据状态" align="center" prop="documentStatus">
          <template #default="scope">
            <dict-tag :options="wms_application_status1" :value="scope.row.documentStatus"/>
          </template>
        </el-table-column>
        <el-table-column label="申请类型" align="center" prop="applicationType">
          <template #default="scope">
            <dict-tag :options="wms_application_type" :value="scope.row.applicationType"/>
          </template>
        </el-table-column>
        <el-table-column label="申请人" align="center" prop="applicantName"/>
        <el-table-column label="申请日期" align="center" prop="applicationDate" width="150">
          <template #default="scope">
            <span>{{ parseTime(scope.row.applicationDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="申请状态" align="center" prop="applicationStatus">
          <template #default="scope">
            <dict-tag :options="wms_application_status" :value="scope.row.applicationStatus"/>
          </template>
        </el-table-column>
        <el-table-column label="审核人" align="center" prop="approvedName"/>
        <el-table-column label="审核日期" align="center" prop="approvedDate" width="150">
          <template #default="scope">
            <span>{{ parseTime(scope.row.approvedDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="审核状态" align="center" prop="approvedStatus">
          <template #default="scope">
            <dict-tag :options="wms_approved_status" :value="scope.row.approvedStatus"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="default-padding fixed-width">
          <template #default="scope">
            <el-button
              size="default"
              type="text"
              @click="handleUpdate(scope.row)"
            >详情
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
  
      <!-- 详情智能仓储WMS-入库申请对话框 -->
      <el-dialog :title="title" v-model="open" width="1000px" append-to-body>
        <el-form ref="formRef" :model="form" :rules="rules" label-width="95px" :inline="true">
  
          <el-form-item label="业务类型" prop="businessType">
            <el-select v-model="form.businessType" placeholder="请选择业务类型" clearable filterable disabled>
              <el-option
                v-for="dict in  wms_application_business"
                :key="dict.value"
                :label="dict.label"
                :value="parseInt(dict.value)"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="关联单据号" prop="associationDocumentNo">
            <el-input v-model="form.associationDocumentNo" disabled>
              <el-button slot="append" disabled>选择
              </el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="申请单号" prop="documentNo">
            <el-input v-model="form.documentNo" disabled/>
          </el-form-item>
          <el-form-item v-if="form.businessType=='2'" label="供应商" prop="supplierId">
            <el-select v-model="form.supplierId" placeholder="请选择供应商" clearable filterable
                       disabled>
              <el-option v-for="item in supplierList" :key="item.id" :label="item.supplierName" :value="item.id"/>
            </el-select>
          </el-form-item>
          <el-form-item v-if="form.businessType!='1'" label="合同号" prop="contractNo">
            <el-input v-model="form.contractNo" disabled/>
          </el-form-item>
          <el-form-item v-if="form.businessType!='1'" label="合同类型" prop="contractType" style="width:200px">
            <el-select v-model="form.contractType" disabled>
              <el-option
                v-for="dict in  wms_application_contract"
                :key="dict.value"
                :label="dict.label"
                :value="parseInt(dict.value)"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="申请类型" prop="applicationType">
            <el-select v-model="form.applicationType" placeholder="" disabled style="width:150px">
              <el-option
                v-for="dict in  wms_application_type"
                :key="dict.value"
                :label="dict.label"
                :value="parseInt(dict.value)"/>
            </el-select>
          </el-form-item>
          <el-form-item label="申请人" prop="applicant">
            <el-select v-model="form.applicant" placeholder="" disabled style="width:150px">
              <el-option v-for="item in userList" :key="item.userId" :label="item.userName" :value="item.userId"/>
            </el-select>
          </el-form-item>
          <el-form-item label="申请日期" prop="applicationDate">
            <el-date-picker size="default" v-model="form.applicationDate" type="date" value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="" disabled/>
          </el-form-item>
          <el-form-item label="申请状态" prop="applicationStatus">
            <el-select v-model="form.applicationStatus" placeholder="" disabled style="width:150px">
              <el-option v-for="dict in  wms_application_status" :key="dict.value" :label="dict.label"
                         :value="parseInt(dict.value)"/>
            </el-select>
          </el-form-item>
          <el-form-item label="审核人" prop="approved">
            <el-select v-model="form.approved" placeholder="" disabled style="width:150px">
              <el-option v-for="item in userList" :key="item.userId" :label="item.userName" :value="item.userId"/>
            </el-select>
          </el-form-item>
          <el-form-item label="审核日期" prop="approvedDate">
            <el-date-picker size="default" v-model="form.approvedDate" type="date" value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="" disabled>
            </el-date-picker>
          </el-form-item>
          <el-form-item label="审核状态" prop="approvedStatus">
            <el-select v-model="form.approvedStatus" placeholder="" disabled style="width:150px">
              <el-option v-for="dict in  wms_approved_status" :key="dict.value" :label="dict.label"
                         :value="parseInt(dict.value)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="审核意见" prop="approvedComments">
            <el-input v-model="form.approvedComments"/>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" placeholder="请输入内容"
                      disabled/>
          </el-form-item>
          <el-divider content-position="center">入库申请明细信息</el-divider>
          <el-table :data="wmsWarehousingApplicationDetailsList" ref="wmsWarehousingApplicationDetails">
            <el-table-column type="selection" width="50" align="center"/>
            <el-table-column label="序号" align="center" prop="index" width="50"/>
            <el-table-column label="物料" prop="materialName" width="150">
              <template #default="scope">
                <el-form-item :prop="'wmsWarehousingApplicationDetailsList.'+scope.$index+'.materialName'"
                              :rules="rules.materialName">
                  <el-input v-model="scope.row.materialName" placeholder="" disabled>
                  </el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="仓库" prop="warehouseId" width="200">
              <template #default="scope">
                <el-form-item :prop="'wmsWarehousingApplicationDetailsList.'+scope.$index+'.warehouseId'"
                              :rules="rules.warehouseId">
                  <el-select v-model="scope.row.warehouseId" placeholder="请选择仓库" style="width:150px"
                             @change="handleWarehouseArea(scope.row)"
                             :disabled="form.applicationStatus!='1' &&form.approvedStatus!='1' ? false:true">
                    <el-option v-for="dict in warehouseList" :key="dict.id" :label="dict.warehouseName"
                               :value="dict.id"></el-option>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="库区" prop="warehouseAreaId" width="200">
              <template #default="scope">
                <el-form-item :prop="'wmsWarehousingApplicationDetailsList.'+scope.$index+'.warehouseAreaId'"
                              :rules="rules.warehouseAreaId">
                  <el-select v-model="scope.row.warehouseAreaId" placeholder="请选择库区" style="width:150px"
                             @change="handleWarehouseSeat(scope.row)"
                             :disabled="form.applicationStatus!='1'&&form.approvedStatus!='1'?false:true">
                    <el-option v-for="dict in scope.row.wmsWarehouseAreaList" :key="dict.id" :label="dict.areaName"
                               :value="dict.id"/>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="库位" prop="warehouseSeatId" width="200">
              <template #default="scope">
                <el-form-item :prop="'wmsWarehousingApplicationDetailsList.'+scope.$index+'.warehouseSeatId'"
                              :rules="rules.warehouseSeatId">
                  <el-select v-model="scope.row.warehouseSeatId" placeholder="请选择库位" style="width:150px"
                             :disabled="form.applicationStatus!='1'&&form.approvedStatus!='1'?false:true">
                    <el-option v-for="dict in scope.row.wmsWarehouseSeatList" :key="dict.id" :label="dict.seatName"
                               :value="dict.id"/>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="发货数量" prop="arrivalNum" width="100">
              <template #default="scope">
                <el-form-item :prop="'wmsWarehousingApplicationDetailsList.'+scope.$index+'.arrivalNum'"
                              :rules="rules.arrivalNum">
                  <el-input v-model.number="scope.row.arrivalNum" placeholder="" disabled/>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="入库数量" prop="receiptNum" width="100">
              <template #default="scope">
                <el-form-item :prop="'wmsWarehousingApplicationDetailsList.'+scope.$index+'.receiptNum'"
                              :rules="rules.receiptNum">
                  <el-input v-model.number="scope.row.receiptNum" placeholder="" disabled/>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="型号" prop="materialModel"/>
            <el-table-column label="规格" prop="materialSpecification"/>
            <el-table-column label="单位" prop="materialUnit"/>
            <el-table-column label="生产批号" prop="batchNumber" width="200">
              <template #default="scope">
                <el-form-item :prop="'wmsWarehousingApplicationDetailsList.'+scope.$index+'.batchNumber'"
                              :rules="rules.batchNumber">
                  <el-input v-model="scope.row.batchNumber" placeholder="请输入生产批号"
                            disabled/>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="生产日期" prop="manufactureDate" width="180">
              <template #default="scope">
                <el-form-item :prop="'wmsWarehousingApplicationDetailsList.'+scope.$index+'.manufactureDate'"
                              :rules="rules.manufactureDate">
                  <el-date-picker clearable v-model="scope.row.manufactureDate" type="date" value-format="yyyy-MM-dd"
                                  placeholder="请选择生产日期"
                                  disabled/>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="生产单位" prop="productionUnit" width="200">
              <template #default="scope">
                <el-form-item :prop="'wmsWarehousingApplicationDetailsList.'+scope.$index+'.productionUnit'"
                              :rules="rules.productionUnit">
                  <el-input v-model="scope.row.productionUnit" placeholder="请输入生产单位"
                            disabled/>
                </el-form-item>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button  v-if="form.applicationStatus == 1" type="primary" @click="submitForm(1)">通 过</el-button>
          <el-button  v-if="form.applicationStatus == 1" type="primary" @click="submitForm(0)">驳 回</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </template>

<script setup>
import {listWarehousingApplication,getWarehousingApplication,listUser,listSupplier,listWarehouse,approveWarehousingApplication} from '@/api/wms/warehousingApplication.js'
import {ref,onMounted,getCurrentInstance} from 'vue'
import Pagination from '@/components/Pagination'
import {ElMessage,ElMessageBox} from 'element-plus'

const {proxy} = getCurrentInstance()
const {
    wms_application_business,
    wms_application_contract,
    wms_application_status1,
    wms_application_status,
    wms_approved_status,
    wms_application_type
} = proxy.useDict(
    "wms_application_business",
    "wms_application_contract",
    "wms_application_status1",
    "wms_application_status",
    "wms_approved_status",
    "wms_application_type"
)
const loading = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const showSearch = ref(true)
const total = ref(0)
const warehousingApplicationList = ref([])
const wmsWarehousingApplicationDetailsList = ref([])
const title = ref("")
const open = ref(false)
const form = ref({})
const queryForm = ref(null)
const formRef = ref(null)
const userList = ref([])
const warehouseList = ref([])
const supplierList = ref([])
const daterangeApplicationDate = ref([])
const daterangeApprovedDate = ref([])

const queryParams = ref({
    pageNum: 1,
    pageSize: 10,
    documentNo: null,
    associationDocumentNo: null,
    contractNo:null,
    status: null,
    applicant: null,
    applicationDate: null,
    applicationStatus: 1,
    approved: null,
    approvedDate: null,
    approvedStatus: null,
    supplierName: null,
    businessType: null,
    contractType: null,
    documentStatus: null,
})
const rules = {
    associationDocumentNo: [
          {required: true, message: "关联单据不能为空", trigger: "blur"}
        ],
        businessType: [
          {required: true, message: "业务类型不能为空", trigger: "blur"}
        ],
        materialName: [
          {required: true, message: "物料不能为空", trigger: "blur"}
        ],
        warehouseId: [
          {required: true, message: "仓库不能为空", trigger: "change"}
        ],
        warehouseSeatId: [
          {required: true, message: "库位不能为空", trigger: "change"}
        ],
        warehouseAreaId: [
          {required: true, message: "库区不能为空", trigger: "change"}
        ],
        arrivalNum: [
          {required: true, message: "发货数量不能为空", trigger: "blur"},
          {type: 'number', min: 1, max: 65535, message: '到货数量必须为数字值且大小要在1到65535'},
        ],
        receiptNum: [
          {required: true, message: "入库数量不能为空", trigger: "blur"},
          {type: 'number', min: 1, max: 65535, message: '入库数量必须为数字值且大小要在1到65535'},
        ],
        batchNumber: [
          {required: true, message: "生产批号不能为空", trigger: "blur"}
        ]
}

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
    listSupplier().then(res => {
        supplierList.value = res.data
    })
    listWarehouse().then(res => {
        warehouseList.value = res.data
    })
    listWarehousingApplication(queryParams.value).then(res => {
        warehousingApplicationList.value = res.rows
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
        id:null,
        associationDocumentNo: null,
        documentNoId: null,
        documentNo: null,
        applicant: null,
        applicationDate: null,
        applicationStatus: null,
        approved: null,
        approvedDate: null,
        approvedStatus: null,
        supplier: null,
        businessType: null,
        contractId: null,
        contractNo: null,
        contractType: null,
        documentStatus: null,
        warehousingStatus: null,
        remark: null,
        approvedComments: null,
    }
    wmsWarehousingApplicationDetailsList.value = []
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
    getWarehousingApplication(id).then(res => {
        form.value = res.data
        wmsWarehousingApplicationDetailsList.value = res.data.wmsWarehousingApplicationDetailsList
        open.value = true
        title.value="入库申请详情"

    })
}
const submitForm = async (status) => {
    form.value.wmsWarehousingApplicationDetailsList = wmsWarehousingApplicationDetailsList.value
    form.value.approvedStatus = status
    approveWarehousingApplication(form.value).then(res => {
        ElMessage.success("审核成功")
        open.value = false
        getList()
    })
}
onMounted(() => getList())
</script>
  