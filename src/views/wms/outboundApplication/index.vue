<template>
    <div class="app-container">
      <el-form :model="queryParams" ref="queryForm" size="default" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="单据号" prop="documentNo">
          <el-input
            v-model="queryParams.documentNo"
            placeholder="请输入单据号"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="客户" prop="customerId">
          <el-select v-model="queryParams.customerId" placeholder="请选择" clearable style="width:200px">
            <el-option
              v-for="dict in customList"
              :key="dict.id"
              :label="dict.customName"
              :value="dict.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="申请人" prop="applicant">
          <el-select v-model="queryParams.applicant" clearable filterable>
            <el-option v-for="dict in userList" :key="dict.userId" :label="dict.userName"
                       :value="dict.userId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="申请日期">
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
        <el-form-item label="审核人" prop="approved">
          <el-select v-model="queryParams.approved" clearable filterable>
            <el-option v-for="dict in userList" :key="dict.userId" :label="dict.userName"
                       :value="dict.userId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核日期">
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
        <el-form-item label="业务类型" prop="businessType">
          <el-select v-model="queryParams.businessType" placeholder="请选择业务类型" clearable style="width:200px">>
            <el-option
              v-for="dict in wms_ountbound_application_type"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="合同类型" prop="contractType">
          <el-select v-model="queryParams.contractType" placeholder="请选择合同类型" clearable style="width:200px">>
            <el-option
              v-for="dict in wms_outbound_application_order_type"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="申请状态" prop="applicationStatus">
          <el-select v-model="queryParams.applicationStatus" placeholder="请选择申请状态" clearable style="width:200px">>
            <el-option
              v-for="dict in wms_outbound_application_application_status"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="审核状态" prop="approvedStatus">
          <el-select v-model="queryParams.approvedStatus" placeholder="请选择审核状态" clearable style="width:200px">>
            <el-option
              v-for="dict in wms_outbound_application_approved_status"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="单据状态" prop="documentStatus">
          <el-select v-model="queryParams.documentStatus" placeholder="请选择单据状态" clearable style="width:200px">>
            <el-option
              v-for="dict in wms_outbound_application_status"
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
  
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="default"
            @click="handleAdd"
          >新增
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="el-icon-edit"
            size="default"
            :disabled="single"
            @click="handleUpdate"
          >修改
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="default"
            :disabled="multiple"
            @click="handleDelete"
          >删除
          </el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>
  
      <el-table v-loading="loading" :data="outboundApplicationList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" :selectable="selectable"/>
        <el-table-column label="编号" align="center" prop="id"/>
        <el-table-column label="单据号" align="center" prop="documentNo"/>
        <el-table-column label="关联单据号" align="center" prop="associationDocumentNo"/>
        <el-table-column label="业务类型" align="center" prop="businessType">
          <template #default="scope">
            <dict-tag :options="wms_ountbound_application_type" :value="scope.row.businessType"/>
          </template>
        </el-table-column>
        <el-table-column label="客户" align="center" prop="customerName"/>
        <el-table-column label="合同编号" align="center" prop="contractNumber"/>
        <el-table-column label="合同类型" align="center" prop="contractType">
          <template #default="scope">
            <dict-tag :options="wms_outbound_application_order_type" :value="scope.row.contractType"/>
          </template>
        </el-table-column>
        <el-table-column label="申请类型" align="center" prop="applicationType">
          <template #default="scope">
            <dict-tag :options="wms_application_type" :value="scope.row.applicationType"/>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" prop="documentStatus">
          <template #default="scope">
            <dict-tag :options="wms_outbound_application_status" :value="scope.row.documentStatus"/>
          </template>
        </el-table-column>
        <el-table-column label="申请人" align="center" prop="applicantName"/>
        <el-table-column label="申请日期" align="center" prop="applicationDate" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.applicationDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="申请状态" align="center" prop="applicationStatus">
          <template #default="scope">
            <dict-tag :options="wms_outbound_application_application_status"
                      :value="scope.row.applicationStatus"/>
          </template>
        </el-table-column>
        <el-table-column label="审核人" align="center" prop="approvedName"/>
        <el-table-column label="审核日期" align="center" prop="approvedDate" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.approvedDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="审核状态" align="center" prop="approvedStatus">
          <template #default="scope">
            <dict-tag :options="wms_outbound_application_approved_status" :value="scope.row.approvedStatus"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="default-padding fixed-width">
          <template #default="scope">
            <el-button
              size="default"
              type="text"
              v-if="scope.row.approvedStatus=='1'&&scope.row.documentStatus=='0'"
              @click="handleOutWarehouse(scope.row)"
            >分拣
            </el-button>
            <el-button
              size="default"
              type="text"
              v-if="scope.row.documentStatus=='2'"
              @click="handleDelivery(scope.row)"
            >发货
            </el-button>
            <el-button
              size="default"
              type="text"
              v-if="scope.row.documentStatus=='1'"
              @click="handleUpdate(scope.row)"
            >盘点
            </el-button>
            <el-button
              size="default"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
            >修改
            </el-button>
            <el-button
              size="default"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-if="scope.row.approvedStatus!='1'&&scope.row.applicationStatus!='1'"
            >删除
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
  
      <!-- 添加或修改智能仓储WMS-出库申请对话框 -->
      <el-dialog :title="title" v-model="open" width="1000px" append-to-body>
        <el-form ref="formRef" :model="form"  label-width="95px" :inline="true" :disabled="form.applicationStatus!='1'&&form.approvedStatus!='1'?false:true">
          <el-form-item label="业务类型" prop="businessType">
            <el-select v-model="form.businessType" placeholder="请选择业务类型" clearable filterable @change="businessTypeChange">
              <el-option
                v-for="dict in wms_ountbound_application_type"
                :key="dict.value"
                :label="dict.label"
                :value="parseInt(dict.value)"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="关联单据号" prop="associationDocumentNo">
            <el-input v-model="form.associationDocumentNo" placeholder="请输入关联单据号" disabled>
              <template #append>
                <el-button   @click="handleSelectDocument">选择
              </el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="单据号" prop="documentNo">
            <el-input v-model="form.documentNo" disabled/>
          </el-form-item>
          <el-form-item v-if="form.businessType=='2'" label="客户" prop="customerId">
            <el-select v-model="form.customerId" placeholder="请选择客户" clearable filterable>
              <el-option v-for="item in customList" :key="item.id" :label="item.customName"
                         :value="parseInt(item.id)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="form.businessType=='2'" label="合同编号" prop="contractNo">
            <el-input v-model="form.contractNo" placeholder="" disabled/>
          </el-form-item>
          <el-form-item v-if="form.businessType=='2'" label="合同类型" prop="contractType" disabled>
            <el-select v-model="form.contractType" placeholder="请选择" clearable filterable>
              <el-option
                v-for="dict in wms_outbound_application_order_type"
                :key="dict.value"
                :label="dict.label"
                :value="parseInt(dict.value)"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="申请人" prop="applicant">
            <el-select v-model="form.applicant" placeholder="" clearable filterable disabled>
              <el-option v-for="dict in userList" :key="dict.userId" :label="dict.userName"
                         :value="dict.userId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="申请日期" prop="applicationDate">
            <el-date-picker clearable size="default" v-model="form.applicationDate" type="date" value-format="yyyy-MM-dd"
                            placeholder="" disabled>
            </el-date-picker>
          </el-form-item>
          <el-form-item label="申请状态" prop="applicationStatus">
            <el-select v-model="form.applicationStatus" placeholder="" clearable filterable disabled>
              <el-option
                v-for="dict in wms_outbound_application_application_status"
                :key="dict.value"
                :label="dict.label"
                :value="parseInt(dict.value)"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="审核人" prop="approved">
            <el-select v-model="form.approved" placeholder="" clearable filterable disabled>
              <el-option v-for="dict in userList" :key="dict.userId" :label="dict.userName"
                         :value="dict.userId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="审核日期" prop="approvedDate">
            <el-date-picker clearable size="default" v-model="form.approvedDate" type="date" value-format="yyyy-MM-dd"
                            placeholder="" disabled>
            </el-date-picker>
          </el-form-item>
          <el-form-item label="审核状态" prop="approvedStatus">
            <el-select v-model="form.approvedStatus" placeholder="" clearable filterable disabled>
              <el-option
                v-for="dict in wms_outbound_application_approved_status"
                :key="dict.value"
                :label="dict.label"
                :value="parseInt(dict.value)"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="审核意见" prop="approvedComments">
            <el-input v-model="form.approvedComments" type="textarea" placeholder="" disabled/>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"/>
          </el-form-item>
          <el-form-item label="单据状态" prop="documentStatus">
            <el-select v-model="form.documentStatus" placeholder="" clearable filterable disabled>
              <el-option
                v-for="dict in wms_outbound_application_status"
                :key="dict.value"
                :label="dict.label"
                :value="parseInt(dict.value)"
              />
            </el-select>
          </el-form-item>
          <el-divider v-if="form.associationDocumentNo" content-position="center">关联单据明细</el-divider>
          <el-table v-if="form.associationDocumentNo" :data="associationList" ref="bizBillDetail">
            <el-table-column label="物料" prop="materialName" width="200"/>
            <el-table-column label="型号" prop="materialModel">
            </el-table-column>
            <el-table-column label="规格" prop="materialSpecifications">
            </el-table-column>
            <el-table-column label="单位" prop="materialUnit">
            </el-table-column>
            <el-table-column label="发货数量" prop="deliveryNum"/>
          </el-table>
          <el-divider content-position="center">出库申请明细</el-divider>
          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button  type="primary"
                         icon="el-icon-plus" size="default" @click="handleAddWmsOutboundApplicationDetails">添加
              </el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button  type="danger" icon="el-icon-delete" size="default" @click="handleDeleteWmsOutboundApplicationDetails">删除
              </el-button>
            </el-col>
          </el-row>
          <el-table :data="wmsOutboundApplicationDetailsList" :row-class-name="rowWmsOutboundApplicationDetailsIndex"
                    @selection-change="handleWmsOutboundApplicationDetailsSelectionChange" ref="wmsOutWarehouseApplyDetail">
            <el-table-column type="selection" width="50" align="center"/>
            <el-table-column label="序号" align="center" prop="index" width="50"/>
            <el-table-column label="物料" prop="materialName" width="300">
              <template #default="scope">
                <el-form-item :prop="'wmsOutboundApplicationDetailsList.'+scope.$index+'.materialName'"
                              >
                  <el-input v-model="scope.row.materialName" placeholder="请选择物料" disabled>
                    <template #append>
                        <el-button   @click="handleSelectMaterial(scope.$index)"
                               >选择
                    </el-button>
                    </template>

                    
                  </el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="仓库" prop="warehouseId" width="200">
              <template #default="scope" style="width:150px">
                <el-form-item :prop="'wmsOutboundApplicationDetailsList.'+scope.$index+'.warehouseId'">
                  <el-select v-model="scope.row.warehouseId" placeholder="请选择仓库" @change="handleWarehouseArea(scope.row)" disabled style="width:150px">
                    <el-option v-for="dict in warehouseList" :key="dict.id" :label="dict.warehouseName" :value="dict.id"></el-option>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="库区" prop="warehouseAreaId" width="200">
              <template #default="scope" style="width:150px">
                <el-form-item :prop="'wmsOutboundApplicationDetailsList.'+scope.$index+'.warehouseAreaId'">
                  <el-select v-model="scope.row.warehouseAreaId" placeholder="请选择库区" @change="handleWarehouseSeat(scope.row)" disabled style="width:150px">
                    <el-option v-for="dict in scope.row.wmsWarehouseAreaList" :key="dict.id" :label="dict.areaName" :value="dict.id"/>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="库位" prop="warehouseSeatId" width="200">
              <template #default="scope" >
                <el-form-item :prop="'wmsOutboundApplicationDetailsList.'+scope.$index+'.warehouseSeatId'">
                  <el-select v-model="scope.row.warehouseSeatId" placeholder="请选择库位" disabled style="width:150px">
                    <el-option v-for="dict in scope.row.wmsWarehouseSeatList" :key="dict.id" :label="dict.seatName"
                               :value="dict.id"/>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="出库数量" prop="outboundNumber" width="150">
              <template #default="scope">
                <el-form-item :prop="'wmsOutboundApplicationDetailsList.'+scope.$index+'.outboundNumber'"
                              >
                  <el-input v-model.number="scope.row.outboundNumber" placeholder=""/>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="型号" prop="materialModel">
            </el-table-column>
            <el-table-column label="规格" prop="materialSpecification">
            </el-table-column>
            <el-table-column label="单位" prop="materialUnit">
            </el-table-column>
            <el-table-column label="生产批号" prop="batchNumber" width="150">
              <template #default="scope">
                <el-form-item :prop="'wmsOutboundApplicationDetailsList.'+scope.$index+'.batchNumber'">
                  <el-input v-model="scope.row.batchNumber" placeholder="" disabled/>
                </el-form-item>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button  v-if="form.documentStatus=='1'" type="primary" @click="checkConfirm">盘点确认</el-button>
          <el-button  v-if="form.applicationStatus!='1'&&form.approvedStatus!='1'" type="primary"
                     @click="saveForm()">保 存
          </el-button>
          <el-button  v-if="form.applicationStatus!='1'&&form.approvedStatus!='1'" type="primary"
                     @click="submitForm()">提 交
          </el-button>
          <el-button  @click="cancel">取 消</el-button>
        </div>
      </el-dialog>
      <!--    领料单-->
      <MaterialApplyDialog status="0" v-model:open="applyOpen" @fun="selectApply" @close="close"/>
      <!--    发货单-->
      <SaleDelivery v-model:open="deliveryOpen" @fun="selectDelivery" @close="close"/>
      <!--    物料库存明细-->
      <MaterialInventoryDetails v-model:open="materialOpen" @fun="selectMaterial" @close="close"/>
    </div>
</template>
<script setup>
import {
  listOutboundApplication,
  getOutboundApplication,
  delOutboundApplication,
  addOutboundApplication,
  updateOutboundApplication,
  listUser, subOutboundApplication, OutBound, outInventoryInfo, outDelivery
} from "@/api/wms/outboundApplication";
import {listCustom} from "@/api/wms/carrierApplication";
import {getArea, getWarehouse, listWarehouse, warehousingApplication} from "@/api/wms/warehousingApplication";
import MaterialApplyDialog from "../../components/MaterialApplyDialog/index.vue";
import SaleDelivery from "../../components/SaleDelivery/index.vue";
import MaterialInventoryDetails from "../../components/MaterialInventoryDetails/index.vue";
import {getApply} from "@/api/mes/apply";
import {getDelivery} from "@/api/scm/delivery";
import {ref,onMounted,getCurrentInstance} from 'vue'
import {ElMessage,ElMessageBox} from 'element-plus'
import Pagination from '@/components/Pagination'
const {proxy} = getCurrentInstance()
const {
    wms_application_type,
    wms_outbound_application_approved_status,
    wms_ountbound_application_type,
    wms_outbound_application_application_status,
    wms_outbound_application_order_type,
    wms_outbound_application_status
} = proxy.useDict(
    "wms_application_type",
    "wms_outbound_application_approved_status",
    "wms_ountbound_application_type",
    "wms_outbound_application_application_status",
    "wms_outbound_application_order_type",
    "wms_outbound_application_status"
)
const loading = ref(true)
const ids = ref([])
const single= ref(true)
const multiple = ref(true)
const showSearch = ref(true)
const total = ref(0)
const outboundApplicationList = ref([])
const checkedWmsOutboundApplicationDetails = ref([])
const wmsOutboundApplicationDetailsList = ref([])
const title = ref("")
const open = ref(false)
const applyOpen = ref(false)
const deliveryOpen = ref(false)
const materialOpen = ref(false)
const daterangeApplicationDate = ref([])
const daterangeApprovedDate = ref([])
const queryParams = ref({
    pageNum: 1,
    pageSize: 10,
    orderId: null,
    type: null,
    orderType: null,
    custom: null,
    status: null,
    applicationName: null,
    applicationDate: null,
    applicationStatus: null,
    approvedName: null,
    approvedDate: null,
    approvedStatus: null
})
const form = ref({})
const formRef = ref(null)
const queryForm = ref(null)
const userList = ref([])
const customList = ref([])
const warehouseList = ref([])
const warehouseAreaList = ref([])
const warehouseSeatList = ref([])
const associationList = ref([])
const materialIndex = ref(null)

const getList = async (paginationParams) => {
    loading.value = true
    if(paginationParams){
        queryParams.value.pageNum = paginationParams.page
        queryParams.value.pageSize = paginationParams.limit
    }
    queryParams.value.params = {}
    if(daterangeApplicationDate.value && daterangeApplicationDate.value === 2){
        queryParams.value.params.beginApplicationDate = daterangeApplicationDate.value[0]
        queryParams.value.params.endApplicationDate = daterangeApplicationDate.value[1]

    }
    if(daterangeApprovedDate.value && daterangeApprovedDate.value === 2){
        queryParams.value.params.beginApprovedDate = daterangeApprovedDate.value[0]
        queryParams.value.params.endApprovedDate = daterangeApprovedDate.value[1]

    }
    listOutboundApplication(queryParams.value).then(res => {
        outboundApplicationList.value = res.rows
        total.value= res.total
        loading.value = false
    })
    listUser().then(res => {
        userList.value = res.data
    })
    listWarehouse().then(res => {
        warehouseList.value = res.data
    })
    listCustom().then(res => {
        customList.value = res.data
    })
}

const handleWarehouseArea = async (warehouseId,index) => {
    getWarehouse(warehouseId).then(res => {
        wmsOutboundApplicationDetailsList.value[index].wmsWarehouseAreaList = res.data.wmsWarehouseAreaList
    })
}

const handleWarehouseSeat = async (warehouseAreaId,index) => {
    getArea(warehouseAreaId).then(res => {
        wmsOutboundApplicationDetailsList.value[index].wmsWarehouseSeatList = res.data.wmsWarehouseSeatList
    })
}

const cancel = async () => {
    open.value = false
    reset()
}

const reset = async () => {
    form.value = {
        id: null,
        associationDocumentNo: null,
        businessType: null,
        documentNo: null,
        customerId: null,
        contractNo: null,
        contractType: null,
        applicant: null,
        applicationDate: null,
        applicationStatus: null,
        approved: null,
        approvedDate: null,
        approvedStatus: null,
        approvedComments: null,
        remark: null,
        documentStatus: null,
        wmsOutboundApplicationDetailsList : []
    }
    associationList.value = []
    if(formRef.value){
        formRef.value.resetFields()
    }    
}
const handleQuery = async () => {
    queryParams.value.pageNum = 1
    getList()
}
const resetQuery = async () => {
    daterangeApplicationDate.value = []
    daterangeApprovedDate.value = []
    queryForm.value.resetFields()
    handleQuery()
}
const handleSelectionChange = async (selection) => {
    ids.value = selection.map(item => item.id)
    single.value = selection.length !==1
    multiple.value = !selection.length
}
const handleAdd = async () => {
    reset()
    open.value = true
    title.value= "添加出库申请"
}
const handleUpdate = async (row) => {
    reset()
    const id = row.id || ids.value[0]
    getOutboundApplication(id).then(res => {
        form.value = res.data
        if(res.data.businessType ==1){
            selectApply(res.data.documentNoId)
        }else if(res.data.businessType ==2){
            selectDelivery(res.data.documentNoId)
        }
        wmsOutboundApplicationDetailsList.value = res.data.wmsOutboundApplicationDetailsList
        open.value = true
        title.value = "修改出库申请"
    })
}

const handleOutWarehouse = async (row) => {
    OutBound({id:row.id}).then(res => {
        ElMessage.success("分拣成功")
        getList()
    })
}
const checkConfirm = async () => {
    outInventoryInfo({id:form.value.id}).then(res => {
        ElMessage.success("盘点成功")
        open.value = false
        getList()
    })
}
const handleDelivery = async (row) => {
    outDelivery({id:row.id}).then(res => {
        ElMessage.success("发货成功")
        getList()
    })
}
const saveForm = async () => {
    form.value.wmsOutboundApplicationDetailsList = wmsOutboundApplicationDetailsList.value
    if(form.value.id != null){
        updateOutboundApplication(form.value).then(res => {
            ElMessage.success("修改成功")
            open.value = false
            getList()
        })
    }else{
        addOutboundApplication(form.value).then(res => {
            ElMessage.success("新增成功")
            open.value = false
            getList()
        })
    }
}

const submitForm = async () => {
    form.value.wmsOutboundApplicationDetailsList = wmsOutboundApplicationDetailsList.value
    subOutboundApplication(form.value).then(res => {
        ElMessage.success("提交成功")
        open.value = false
        getList()
    })
}
const handleDelete = async (row) => {
    const ids=  row.id || ids.value
    ElMessageBox.confirm('是否确认删除出库申请编号为"' + ids +'"的数据项？',{
        confirmButtonText:'确认',
        cancelButtonText:'取消'
    }).then(() => {
        return delOutboundApplication(ids)
    }).then(() => {
        getList()
        ElMessage.success("删除成功")
    }).catch(() => {})
}
const rowWmsOutboundApplicationDetailsIndex = async ({row,rowIndex}) => {
    row.index = rowIndex + 1
}
const handleAddWmsOutboundApplicationDetails = async () => {
    let obj = {}
    obj.warehouseId = '';
      obj.warehouseAreaId = '';
      obj.warehouseSeatId = '';
      obj.materialId = '';
      obj.materialName = '';
      obj.materialModel = '';
      obj.materialSpecification = '';
      obj.materialUnit = '';
      obj.batchNumber = '';
      obj.outboundNumber = '';
      obj.wmsWarehouseAreaList = []
      obj.wmsWarehouseSeatList = []
      wmsOutboundApplicationDetailsList.value.push(obj);
}
const handleDeleteWmsOutboundApplicationDetails = async () => {
    if(checkedWmsOutboundApplicationDetails.value.length == 0){
        ElMessage.error("请先选择要删除的出库申请明细数据")
    }else {
        const wmsOutboundApplicationDetailsList1 = wmsOutboundApplicationDetailsList.value
        const checkedWmsOutboundApplicationDetails1 = checkedWmsOutboundApplicationDetails.value
        wmsOutboundApplicationDetailsList.value = wmsOutboundApplicationDetailsList1.filter(function (item) {
            return checkedWmsOutboundApplicationDetails1.indexOf(item.index) == -1
        })
    }
}
const handleWmsOutboundApplicationDetailsSelectionChange = async (selection) => {
    checkedWmsOutboundApplicationDetails.value = selection.map(item => item.index)
}
const  businessTypeChange = async (val) =>{
    reset()
    form.value.businessType = val
}
const handleSelectDocument = async () => {
    if(!form.value.businessType){
        ElMessage.error('请选择业务类型')
        return
    }
    if(form.value.businessType == '1' ){
        applyOpen.value = true
    }else if(form.value.businessType =='2'){
        deliveryOpen.value = true
    }
}
const handleSelectMaterial = async (index) => {
    materialOpen.value = true
    materialIndex.value = index
}
const selectApply = async (val) => {
    console.log(val)
    getApply(val.id ? val.id:val).then(res => {
        form.value.associationDocumentNo = res.data.oddNumber
        form.value.documentNoId = res.data.id
        associationList.value = res.data.mesMaterialApplyItemList
        associationList.value.map(item => {
            item.deliveryNum = item.dosage
        })
    })
    applyOpen.value = false
}
const selectDelivery = async (val) => {
    console.log(val)
    getDelivery(val.id ? val.id:val).then(res => {
        form.value.associationDocumentNo = res.data.deliveryNo
        form.value.documentNoId = res.data.id
        associationList.value = res.data.scmSaleDeliveryItemList
        form.value.customerId = parseInt(res.data.customId)
        form.value.contractNo = res.data.contractNo
        form.value.cantractType =2
    })
    deliveryOpen.value = false
}
const selectMaterial = async (val) => {
    console.log(val)
    wmsOutboundApplicationDetailsList.value[materialIndex.value].warehouseId = val.warehouseId;
    wmsOutboundApplicationDetailsList.value[materialIndex.value].warehouseAreaId = val.areaId;
    wmsOutboundApplicationDetailsList.value[materialIndex.value].warehouseSeatId = val.seatId;
    wmsOutboundApplicationDetailsList.value[materialIndex.value].materialId = val.materialId;
    wmsOutboundApplicationDetailsList.value[materialIndex.value].materialName = val.materialName;
    wmsOutboundApplicationDetailsList.value[materialIndex.value].materialModel = val.materialModel;
    wmsOutboundApplicationDetailsList.value[materialIndex.value].materialSpecification = val.materialSpecifications;
    wmsOutboundApplicationDetailsList.value[materialIndex.value].materialUnit = val.materialUnit;
    wmsOutboundApplicationDetailsList.value[materialIndex.value].batchNumber = val.batchNumber;
    wmsOutboundApplicationDetailsList.value[materialIndex.value].outboundNumber = val.outboundNumber;
    handleWarehouseArea(val.warehouseId, materialIndex.value)
    handleWarehouseSeat(val.areaId, materialIndex.value)
}
const close = async () => {
    applyOpen.value = false
    deliveryOpen.value = false
    materialOpen.value = false
}
const selectable = async (row,index) => {
    if(row.applicationStatus == '1' || row.approvedStatus == '1'){
        return false
    }else{
        return true
    }
}
onMounted(() => getList())
</script>