<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm"  :inline="true"  label-width="90px">
      <el-form-item label="申请单号" prop="documentNo">
        <el-input v-model="queryParams.documentNo" placeholder="请输入申请单号" clearable size="default"
                  @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="业务类型" prop="businessType">
        <el-select v-model="queryParams.businessType" placeholder="请选择业务类型" clearable style="width:150px">
          <el-option
            v-for="dict in wms_application_business"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="供应商" prop="supplierId">
        <el-select v-model="queryParams.supplierId" placeholder="请选择供应商" clearable size="default" style="width:150px">
          <el-option v-for="item in supplierList" :key="item.id" :label="item.supplierName" :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="合同类型" prop="contractType">
        <el-select v-model="queryParams.contractType" placeholder="请选择合同类型" clearable style="width:150px">
          <el-option
            v-for="dict in wms_application_contract"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="入库状态" prop="documentStatus">
        <el-select v-model="queryParams.documentStatus" placeholder="请选择入库状态" clearable style="width:150px">
          <el-option
            v-for="dict in wms_application_status1"
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
          value-format="YYYY-MM-DD"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="申请状态" prop="applicationStatus">
        <el-select v-model="queryParams.applicationStatus" placeholder="请选择申请状态" clearable style="width:150px">
          <el-option
            v-for="dict in wms_application_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
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
          value-format="YYYY-MM-DD"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="审核状态" prop="approvedStatus">
        <el-select v-model="queryParams.approvedStatus" placeholder="请选择审核状态" clearable style="width:150px">
          <el-option
            v-for="dict in wms_approved_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="default" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="default">重置</el-button>
      </el-form-item>
    </el-form>
<el-table v-loading="loading" :data="warehousingApplicationList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" :selectable="selectable"/>
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
            icon="el-icon-setting"
            @click="handleWarehousing(scope.row)"
            v-if="scope.row.approvedStatus == 1 && scope.row.documentStatus != 1"
          >入库
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
    </div>

<el-dialog :title="title" v-model="open" width="1000px" append-to-body>
      <el-form ref="formRef" :model="form"  label-width="95px" :inline="true" :disabled="form.applicationStatus!='1'&&form.approvedStatus!='1'?false:true">

        <el-form-item label="业务类型" prop="businessType">
          <el-select v-model="form.businessType" placeholder="请选择业务类型" clearable filterable
                     @change="businessTypeChange">
            <el-option
              v-for="dict in wms_application_business"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="关联单据号" prop="associationDocumentNo">
          <el-input v-model="form.associationDocumentNo" disabled>
            <template #append>
              <el-button  @click="handleSelectDocument">选择</el-button>
            </template>

            
          </el-input>
        </el-form-item>
        <el-form-item label="申请单号" prop="documentNo">
          <el-input v-model="form.documentNo" disabled/>
        </el-form-item>
        <el-form-item v-if="form.businessType=='2'" label="供应商" prop="supplierId">
          <el-select v-model="form.supplierId" placeholder="请选择供应商" clearable filterable>
            <el-option v-for="item in supplierList" :key="item.id" :label="item.supplierName" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.businessType!='1'" label="合同号" prop="contractNo">
          <el-input v-model="form.contractNo" disabled/>
        </el-form-item>
        <el-form-item v-if="form.businessType!='1'" label="合同类型" prop="contractType" style="width: 200px">
          <el-select v-model="form.contractType" disabled>
            <el-option
              v-for="dict in wms_application_contract"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="申请类型" prop="applicationType" style="width: 200px">
          <el-select v-model="form.applicationType" placeholder="" disabled>
            <el-option
              v-for="dict in wms_application_type"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"/>
          </el-select>
        </el-form-item>
        <el-form-item label="申请人" prop="applicant" style="width: 200px">
          <el-select v-model="form.applicant" placeholder="" disabled>
            <el-option v-for="item in userList" :key="item.userId" :label="item.userName" :value="item.userId"/>
          </el-select>
        </el-form-item>
        <el-form-item label="申请日期" prop="applicationDate">
          <el-date-picker size="default" v-model="form.applicationDate" type="date" value-format="YYYY-MM-DD HH:mm:ss"
                          placeholder="" disabled/>
        </el-form-item>
        <el-form-item label="申请状态" prop="applicationStatus" style="width: 200px">
          <el-select v-model="form.applicationStatus" placeholder="" disabled>
            <el-option v-for="dict in wms_application_status" :key="dict.value" :label="dict.label"
                       :value="parseInt(dict.value)"/>
          </el-select>
        </el-form-item>
        <el-form-item label="审核人" prop="approved">
          <el-select v-model="form.approved" placeholder="" disabled style="width: 200px">
            <el-option v-for="item in userList" :key="item.userId" :label="item.userName" :value="item.userId"/>
          </el-select>
        </el-form-item>
        <el-form-item label="审核日期" prop="approvedDate">
          <el-date-picker size="default" v-model="form.approvedDate" type="date" value-format="YYYY-MM-DD HH:mm:ss"
                          placeholder="" disabled>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="审核状态" prop="approvedStatus">
          <el-select v-model="form.approvedStatus" placeholder="" disabled style="width: 200px">
            <el-option v-for="dict in wms_approved_status" :key="dict.value" :label="dict.label"
                       :value="parseInt(dict.value)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核意见" prop="approvedComments">
          <el-input v-model="form.approvedComments" disabled/>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入内容"/>
        </el-form-item>
        <el-divider content-position="center">入库申请明细信息</el-divider>
        <el-table :data="wmsWarehousingApplicationDetailsList"
                  :row-class-name="rowWmsWarehousingApplicationDetailsIndex"
                  ref="wmsWarehousingApplicationDetails">
          <el-table-column type="selection" width="50" align="center"/>
          <el-table-column label="序号" align="center" prop="index" width="50"/>
          <el-table-column label="物料" prop="materialName" width="150">
            <template #default="scope">
              <el-form-item :prop="'wmsWarehousingApplicationDetailsList.'+scope.$index+'.materialName'"
                            >
                <el-input v-model="scope.row.materialName" placeholder="" disabled>
                </el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="仓库" prop="warehouseId" width="200px">
            <template #default="scope">
              <el-form-item :prop="'wmsWarehousingApplicationDetailsList.'+scope.$index+'.warehouseId'"
                            >
                <el-select v-model="scope.row.warehouseId" placeholder="请选择仓库" style="width: 150px"
                           @change="handleWarehouseArea(scope.row)">
                  <el-option v-for="dict in warehouseList" :key="dict.id" :label="dict.warehouseName"
                             :value="dict.id"></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="库区" prop="warehouseAreaId" width="200">
            <template #default="scope">
              <el-form-item :prop="'wmsWarehousingApplicationDetailsList.'+scope.$index+'.warehouseAreaId'"
                            >
                <el-select v-model="scope.row.warehouseAreaId" placeholder="请选择库区" style="width: 150px"
                           @change="handleWarehouseSeat(scope.row)">
                  <el-option v-for="dict in scope.row.wmsWarehouseAreaList" :key="dict.id" :label="dict.areaName"
                             :value="dict.id"/>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="库位" prop="warehouseSeatId" width="200">
            <template #default="scope">
              <el-form-item :prop="'wmsWarehousingApplicationDetailsList.'+scope.$index+'.warehouseSeatId'"
                            >
                <el-select v-model="scope.row.warehouseSeatId" placeholder="请选择库位" style="width: 150px">
                  <el-option v-for="dict in scope.row.wmsWarehouseSeatList" :key="dict.id" :label="dict.seatName"
                             :value="dict.id"/>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="发货数量" prop="arrivalNum" width="100">
            <template #default="scope">
              <el-form-item :prop="'wmsWarehousingApplicationDetailsList.'+scope.$index+'.arrivalNum'"
                            >
                <el-input v-model.number="scope.row.arrivalNum" placeholder="" disabled/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="入库数量" prop="receiptNum" width="200">
            <template #default="scope">
              <el-form-item :prop="'wmsWarehousingApplicationDetailsList.'+scope.$index+'.receiptNum'"
                            >
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
                            >
                <el-input v-model="scope.row.batchNumber" placeholder="请输入生产批号"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="生产日期" prop="manufactureDate" width="180">
            <template #default="scope">
              <el-form-item :prop="'wmsWarehousingApplicationDetailsList.'+scope.$index+'.manufactureDate'"
                            >
                <el-date-picker clearable v-model="scope.row.manufactureDate" type="date" value-format="YYYY-MM-DD"
                                placeholder="请选择生产日期"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="生产单位" prop="productionUnit" width="200">
            <template #default="scope">
              <el-form-item :prop="'wmsWarehousingApplicationDetailsList.'+scope.$index+'.productionUnit'"
                            >
                <el-input v-model="scope.row.productionUnit" placeholder="请输入生产单位"
                          />
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="form.applicationStatus!='1'&&form.approvedStatus!='1'" type="primary" @click="saveForm()">保 存</el-button>
        <el-button v-if="form.applicationStatus!='1'&&form.approvedStatus!='1'" type="primary" @click="submitForm()">提 交</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!--    选择采购到货单-->
    <ArriveSelect v-model:open="arriveSelectOpen" @onArriveSelected="handleArrive" @close="close"></ArriveSelect>
    <!--选择生产完工单-->
    <Completion status="3" v-model:open="completionOpen" @fun="selectCompletion" @close="close"/>
    <!--选择销售退货单-->
    <SaleReturn v-model:open="saleReturnOpen" @close="close" @onSaleReturnSelected="saleReturnSelected"></SaleReturn>
</template>


<script setup>
import {listWarehousingApplication,
  getWarehousingApplication,
  delWarehousingApplication,
  addWarehousingApplication,
  updateWarehousingApplication,
  listUser,
  listSupplier,
  listWarehouse,
  getWarehouse,
  getArea, subWarehousingApplication, warehousingApplication} from '@/api/wms/warehousingApplication'
import {getReturn} from '@/api/scm/return'
import {getArrival} from '@/api/scm/arrival'
import SaleReturn from "../../components/Sale/SaleReturn.vue";
import ArriveSelect from "../../components/Purchase/ArrivalOrder.vue";
import Completion from "../../components/Completion/index.vue";

import {ref,onMounted,getCurrentInstance} from 'vue'
import {ElMessage,ElMessageBox} from 'element-plus'
import Pagination from '@/components/Pagination'
const {proxy} = getCurrentInstance()
const {
    wms_application_status,
    wms_application_business,
    wms_warehousing_application_document_no,
    wms_application_contract,
    wms_approved_status,
    wms_application_status1,
    scm_put_status,
    wms_document_status,
    wms_application_type
} = proxy.useDict(
    "wms_application_status",
    "wms_application_business",
    "wms_warehousing_application_document_no",
    "wms_application_contract",
    "wms_approved_status",
    "wms_application_status1",
    "scm_put_status",
    "wms_document_status",
    "wms_application_type"
)
const loading = ref(true)
const ids = ref([])
const single= ref(true)
const multiple = ref(true)
const showSearch = ref(true)
const total = ref(0)
const warehousingApplicationList = ref([])
const wmsWarehousingApplicationDetailsList = ref([])
const title= ref("")
const open = ref(false)
const saleReturnOpen = ref(false)
const arriveSelectOpen = ref(false)
const completionOpen = ref(false)
const form = ref({})
const formRef = ref(null)
const userList = ref([])
const warehouseList = ref([])
const supplierList = ref([])
const daterangeApplicationDate = ref([])
const daterangeApprovedDate = ref([])
const queryParams = ref({
    pageNum:1,
    pageSize:10,
    documentNo: null,
    status: null,
    applicant: null,
    applicationDate: null,
    applicationStatus: null,
    approved: null,
    approvedDate: null,
    approvedStatus: null,
    supplierName: null,
    businessType: null,
    contractType: null,
    documentStatus: null
})

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
    listUser().then(res => {
        userList.value = res.data
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
const handleQuery = async () => {
    queryParams.value.pageNum = 1
    getList()
}
const reset = async () => {
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
        wmsWarehousingApplicationDetailsList:[]
    }
    if(formRef.value){
        formRef.value.resetFields()
    }
}
const handleSelectionChange = async (selection) => {
    ids.value = selection.map(item => item.id)
    single.value = selection.length !==1
    multiple.value = !selection.length
}
const handleUpdate = async (row) => {
    reset()
    const id = row.id || ids.value[0]
    getWarehousingApplication(id).then(res => {
        form.value = res.data
        wmsWarehousingApplicationDetailsList.value = res.data.wmsWarehousingApplicationDetailsList
        open.value = true
        title.value = "修改入库申请"
    })
}
const cancel = async => {
    open.value = false
    reset()
}
const handleWarehousing = async(row) => {
    warehousingApplication({id:row.id}).then(res => {
        ElMessage.success("入库成功")
        getList()
    })
}
const saveForm = async () => {
    form.value.wmsWarehousingApplicationDetailsList = wmsWarehousingApplicationDetailsList.value
    if(form.value.id != null){
        updateWarehousingApplication(form.value).then(res => {
            ElMessage.success("修改成功")
            open.value = false
            getList()
        })
    }else{
        addWarehousingApplication(form.value).then(res => {
            ElMessage.success("新增成功")
            open.value = false
            getList()
        })
    }
}
const submitForm = async () => {
    form.value.wmsWarehousingApplicationDetailsList = wmsWarehousingApplicationDetailsList.value
    subWarehousingApplication(form.value).then(res => {
        ElMessage.success("提交成功")
        open.value = false
        getList()
    })
}
const handleDelete = async (row) => {
    const ids = row.id || ids.value
    ElMessageBox.confirm('是否确认删除入库申请编号为"'+ ids +'"的数据项？',{
        confirmButtonText:"确认",
        cancelButtonText:"取消"
    }).then(() => {
        return delWarehousingApplication(ids)
    }).then(() => {
        getList()
        ElMessage.success("删除成功")
    }).catch(() => {})
}
const rowWmsWarehousingApplicationDetailsIndex = async ({row,rowIndex}) => {
    row.index = rowIndex +1
}
const handleWarehouseArea = async (row) => {
    wmsWarehousingApplicationDetailsList.value[row.index - 1].warehouseAreaId = ''
    getWarehouse(row.warehouseId).then(res => {
        wmsWarehousingApplicationDetailsList.value[row.index - 1].wmsWarehouseAreaList = res.data.wmsWarehouseAreaList

    })

}
const handleWarehouseSeat = async (row) => {
    wmsWarehousingApplicationDetailsList.value[row.index - 1].warehouseSeatId = ''
    getArea(row.warehouseAreaId).then(res => {
        wmsWarehousingApplicationDetailsList.value[row.index - 1].wmsWarehouseSeatList = res.data.wmsWarehouseSeatList
    })
}
const businessTypeChange = async (val) => {
    reset()
    form.value.businessType = val
}
const handleSelectDocument = async () => {
    if(!form.value.businessType){
        ElMessage.error("请选择业务类型")
        return
    }
    if(form.value.businessType == '1'){
        completionOpen.value = true
        console.log(completionOpen.value);
    }
    if(form.value.businessType == '2'){
        arriveSelectOpen.value = true
        console.log(arriveSelectOpen.value);
    }
    if(form.value.businessType == '3'){
        saleReturnOpen.value = true
        console.log(saleReturnOpen.value);
    }
}
const saleReturnSelected = async (row) => {
    getReturn(row.id).then(res => {
        form.value.associationDocumentNo = res.data.returnNo
        form.value.documentNoId = res.data.id
        form.value.contractNo = res.data.contractNo
        if(form.value.businessType == '2'){
            form.value.contractType =1
        }else if (form.value.businessType == '3'){
            form.value.contractType =2
        }
        wmsWarehousingApplicationDetailsList.value = []
        let data = res.data.scmSaleReturnItemList
        data.forEach(item => {
            let obj = {}
            obj.materialId = item.materialId;
          obj.materialName = item.materialName;
          obj.materialModel = item.materialModel;
          obj.materialSpecification = item.materialSpecifications;
          obj.materialUnit = item.materialUnit;
          obj.arrivalNum = item.deliveryNum;
          obj.receiptNum = item.returnNum;
          obj.batchNumber = '';
          obj.manufactureDate = '';
          obj.productionUnit = '';
          obj.warehouseId = '';
          obj.warehouseAreaId = '';
          obj.warehouseSeatId = '';
          obj.wmsWarehouseAreaList = []
          obj.wmsWarehouseSeatList = []
            wmsWarehousingApplicationDetailsList.value.push(obj)
        })
    })
    saleReturnOpen.value = false
}
const handleArrive = async (row) => {
    getArrival(row.id).then(res => {
        form.value.associationDocumentNo = res.data.deliveryNumber
        form.value.documentNoId = res.data.id
        form.value.contractNo = res.data.purchasingContractNo
        if(form.value.businessType == '2'){
            form.value.contractType = 1
        }else if (form.value.businessType == '3'){
            form.value.contractType = 2
        }
        let data = res.data.scmPurchaseArrivalItemList
        wmsWarehousingApplicationDetailsList.value = []
        data.forEach(item => {
            let obj = {}
            obj.materialId = item.materialId;
          obj.materialName = item.materialName;
          obj.materialModel = item.materialModel;
          obj.materialSpecification = item.materialSpecifications;
          obj.materialUnit = item.materialUnit;
          obj.arrivalNum = item.arrivalQuantity;
          obj.receiptNum = item.arrivalQuantity - item.returnQuantity;
          obj.batchNumber = item.batchNumber;
          obj.manufactureDate = '';
          obj.productionUnit = '';
          obj.warehouseId = '';
          obj.warehouseAreaId = '';
          obj.warehouseSeatId = '';
          obj.wmsWarehouseAreaList = []
          obj.wmsWarehouseSeatList = []
          wmsWarehousingApplicationDetailsList.value.push(obj)
        })
    })
    arriveSelectOpen.value = false
}
const selectCompletion = async (row) => {
    wmsWarehousingApplicationDetailsList.value = []
    form.value.associationDocumentNo = row.oddNumbers
    form.value.documentNoId = row.id
    let obj ={}
    obj.materialId = row.materialId;
      obj.materialName = row.materialName;
      obj.materialModel = row.materialModel;
      obj.materialSpecification = row.materialSpecifications;
      obj.materialUnit = row.materialUnit;
      obj.arrivalNum = row.quantity;
      obj.receiptNum = row.quantity;
      obj.batchNumber = row.batchNumber;
      obj.manufactureDate = '';
      obj.productionUnit = '';
      obj.warehouseId = '';
      obj.warehouseAreaId = '';
      obj.warehouseSeatId = '';
      obj.wmsWarehouseAreaList = []
      obj.wmsWarehouseSeatList = []
      wmsWarehousingApplicationDetailsList.value.push(obj)
    completionOpen.value = false
}
const close = async () => {
    saleReturnOpen.value = false
    arriveSelectOpen.value=false
    completionOpen.value=false
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