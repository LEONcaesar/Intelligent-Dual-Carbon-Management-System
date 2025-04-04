<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" :inline="true" >
      <el-form-item label="单据号" prop="documentNo">
        <el-input
          v-model="queryParams.documentNo"
          placeholder="请输入单据号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="出库单号" prop="outboundNo">
        <el-input
          v-model="queryParams.outboundNo"
          placeholder="请输入出库单号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="发货单号" prop="deliverNo">
        <el-input
          v-model="queryParams.deliverNo"
          placeholder="请输入发货单号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="客户" prop="customId">
        <el-select v-model="queryParams.customId" placeholder="请选择客户" clearable style="width:150px">
          <el-option
            v-for="dict in customList"
            :key="dict.id"
            :label="dict.customName"
            :value="dict.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="申请人" prop="applicant">
        <el-select v-model="queryParams.applicant" placeholder="请选择申请人" clearable style="width:150px">
          <el-option
            v-for="dict in userList"
            :key="dict.userId"
            :label="dict.userName"
            :value="parseInt(dict.userId)"
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
        <el-select v-model="queryParams.applicationStatus" placeholder="请选择申请状态" clearable style="width:150px"> 
          <el-option
            v-for="dict in wms_carrier_application_status"
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
        <el-select v-model="queryParams.approvedStatus" placeholder="请选择审核状态" clearable style="width:150px">
          <el-option
            v-for="dict in wms_carrier_approved_status"
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

    <el-table v-loading="loading" :data="carrierList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="编号" align="center" prop="id" />
      <el-table-column label="单据号" align="center" prop="documentNo" />
      <el-table-column label="出库单号" align="center" prop="outboundNo" />
      <el-table-column label="发货单号" align="center" prop="deliverNo" />
      <el-table-column label="客户" align="center" prop="customerName" />
      <el-table-column label="收货地址" align="center" prop="address" />
      <el-table-column label="联系人" align="center" prop="contacts" />
      <el-table-column label="联系电话" align="center" prop="telephone" />
      <el-table-column label="承运人" align="center" prop="carrierName" />
      <el-table-column label="运输距离" align="center" prop="distance" />
      <el-table-column label="申请人" align="center" prop="applicantName" />
      <el-table-column label="申请日期" align="center" prop="applicationDate" width="120">
        <template #default="scope">
          <span>{{ parseTime(scope.row.applicationDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请状态" align="center" prop="applicationStatus">
        <template #default="scope">
          <dict-tag :options="wms_carrier_application_status" :value="scope.row.applicationStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="审核人" align="center" prop="approvedName">
      </el-table-column>
      <el-table-column label="审核日期" align="center" prop="approvedDate" width="120">
        <template #default="scope">
          <span>{{ parseTime(scope.row.approvedDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" align="center" prop="approvedStatus">
        <template #default="scope">
          <dict-tag :options="wms_carrier_approved_status" :value="scope.row.approvedStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="120">
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

    <!-- 添加或修改智能仓储WMS-运输管理-承运申请对话框 -->
    <el-dialog :title="title" v-model="open" width="1050px" append-to-body>
      <el-form ref="formRef" :model="form"  label-width="80px"  :inline="true">
        <el-form-item label="单据号" prop="documentNo">
          <el-input v-model="form.documentNo" placeholder="请输入单据号" disabled/>
        </el-form-item>
        <el-form-item label="出库单号" prop="outboundNo">
          <el-input v-model="form.outboundNo" placeholder="请输入出库单号" disabled/>
        </el-form-item>
        <el-form-item label="发货单号" prop="deliverNo">
          <el-input v-model="form.deliverNo" placeholder="请输入发货单号" disabled/>
        </el-form-item>
        <el-form-item label="客户" prop="customId">
          <el-select v-model="form.customId" placeholder="请选择客户" disabled style="width:150px">
            <el-option
              v-for="dict in customList"
              :key="dict.id"
              :label="dict.customName"
              :value="dict.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="交货日期" prop="deliveryDate">
          <el-date-picker clearable
            v-model="form.deliveryDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择交货日期"
            disabled>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="收货地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入收货地址" disabled/>
        </el-form-item>
        <el-form-item label="联系人" prop="contacts">
          <el-input v-model="form.contacts" placeholder="请输入联系人" disabled/>
        </el-form-item>
        <el-form-item label="联系电话" prop="telephone">
          <el-input v-model="form.telephone" placeholder="请输入联系电话" disabled/>
        </el-form-item>
        <el-form-item label="承运人" prop="carrier">
          <el-select v-model="form.carrier" placeholder="请选择承运人" clearable disabled style="width:150px">
            <el-option
              v-for="dict in userList"
              :key="dict.userId"
              :label="dict.userName"
              :value="dict.userId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="运输距离" prop="distance">
          <el-input v-model="form.distance" placeholder="请输入运输距离" disabled/>
        </el-form-item>
        <el-form-item label="申请人" prop="applicant">
          <el-select v-model="form.applicant" placeholder="请选择申请人" disabled style="width:150px">
            <el-option
              v-for="dict in userList"
              :key="dict.userId"
              :label="dict.userName"
              :value="dict.userId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="申请日期" prop="applicationDate">
          <el-date-picker clearable
            v-model="form.applicationDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择申请日期"
            disabled>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="申请状态" prop="applicationStatus">
          <el-select v-model="form.applicationStatus" placeholder="请选择申请状态" disabled style="width:150px">
            <el-option
              v-for="dict in wms_carrier_application_status"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" disabled/>
        </el-form-item>
        <el-form-item label="审核意见" prop="approvedComments">
          <el-input v-model="form.approvedComments" placeholder="请输入审核意见" />
        </el-form-item>
        <el-divider content-position="center">承运申请明细信息</el-divider>
        <el-table :data="wmsCarrierApplicationDetailsList" ref="wmsCarrierApplicationDetails">
          <el-table-column label="序号" align="center" type="index" width="50"/>
          <el-table-column label="物料" prop="material" width="150">
            <template #default="scope">
              <el-input v-model="scope.row.materialName" disabled />
            </template>
          </el-table-column>
          <el-table-column label="生产批号" prop="batchNumber" width="150">
            <template #default="scope">
              <el-input v-model="scope.row.batchNumber" disabled />
            </template>
          </el-table-column>
          <el-table-column label="仓库" prop="warehouse" width="150">
            <template #default="scope">
              <el-select v-model="scope.row.warehouseId" disabled>
                <el-option
                  v-for="warehouse in warehouseList"
                  :key="warehouse.id"
                  :label="warehouse.warehouseName"
                  :value="warehouse.id"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="库区" prop="area" width="150">
            <template #default="scope">
              <el-select v-model="scope.row.warehouseAreaId" placeholder="请选择库区" disabled>
                <el-option
                  v-for="area in scope.row.wmsWarehouseAreaList"
                  :key="area.id"
                  :label="area.areaName"
                  :value="area.id"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="库位" prop="seat" width="150">
            <template #default="scope">
              <el-select v-model="scope.row.warehouseSeatId" placeholder="请选择库位" disabled >
                <el-option
                  v-for="seat in scope.row.wmsWarehouseSeatList"
                  :key="seat.id"
                  :label="seat.seatName"
                  :value="seat.id"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="发货数量" prop="shipmentQuantity" width="150">
            <template #default="scope">
              <el-input v-model="scope.row.shipmentQuantity" disabled />
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
import {
  listCarrierApplication,
  getCarrierApplication,
  listCustom,
  listUser,
  carrierApplication,
  listWarehouse,
} from "@/api/wms/carrierApplication";
import { ElMessage } from "element-plus";
import {ref,onMounted,getCurrentInstance} from 'vue'
const {proxy} = getCurrentInstance()
const {
    wms_carrier_application_status,
    wms_carrier_approved_status,
} = proxy.useDict(
    "wms_carrier_application_status",
    "wms_carrier_approved_status"
)
const loading = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const showSearch = ref(true)
const total = ref(0)
const carrierList = ref([])
const wmsCarrierApplicationDetailsList = ref([])
const title = ref("")
const open = ref(false)
const daterangeApplicationDate = ref([])
const daterangeApprovedDate = ref([])
const formRef = ref(null)
const queryForm = ref(null)
const queryParams = ref({
    pageNum:1,
    pageSize:10,
    documentNo:null,
    outboundNo:null,
    deliverNo:null,
    customId:null,
    applicant:null,
    applicationDate:null,
    applicationStatus:null,
    approved:null,
    approvedDate:null,
    approvedStatus:null,

})
const form = ref({})
const userList = ref([])
const customList = ref([])
const warehouseList = ref([])
const getList = async () => {
    loading.value = true
    queryParams.value.params ={}
    if(daterangeApplicationDate && daterangeApplicationDate === 2){
        queryParams.value.params.beginApplicationDate = daterangeApplicationDate.value[0]
        queryParams.value.params.endApplicationDate = daterangeApplicationDate.value[1]

    }
    if(daterangeApprovedDate && daterangeApprovedDate === 2){
        queryParams.value.params.beginApprovedDate = daterangeApprovedDate.value[0]
        queryParams.value.params.endApprovedDate = daterangeApprovedDate.value[1]

    }
    listUser().then(res => {
        userList.value = res.data
    })
    listCustom().then(res => {
        customList.value = ref.data
    })
    listCarrierApplication(queryParams.value).then(res => {
      carrierList.value = res.rows
        total.value = res.total
        loading.value = false
    })
    console.log(carrierApplicationList);
}
const cancel = async () => {
    open.value = false
    reset()
}
const reset = async () => {
    form.value={
        id: null,
        documentNo: null,
        outboundNo: null,
        deliverNo: null,
        custom: null,
        deliveryDate: null,
        address: null,
        contacts: null,
        telephone: null,
        carrier: null,
        distance: null,
        applicant: null,
        applicationDate: null,
        applicationStatus: null,
        approved: null,
        approvedDate: null,
        approvedStatus: null,
        remark: null,
        approvedComments: null
    }
    wmsCarrierApplicationDetailsList.value = []
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
const handleUpdate = async (row) => {
    reset()
    listWarehouse().then(res => {
        warehouseList.value = res.data
    })
    const id = row.id || ids.value[0]
    getCarrierApplication(id).then(res => {
        form.value = res.data
        wmsCarrierApplicationDetailsList.value = res.data.wmsCarrierApplicationDetailsList
        open.value = true
        title.value = "修改承运申请"
    })
}
const submitForm = async (status) => {
    form.value.wmsCarrierApplicationDetailsList = wmsCarrierApplicationDetailsList.value
    form.value.approvedStatus = status
    carrierApplication(form.value).then(res => {
        ElMessage.success("审核成功")
        open.value = false
        getList
    })
}
const rowWmsOutboundApplicationDetailsIndex = async ({row,rowIndex}) => {
    row.index = rowIndex + 1
}
onMounted(() => getList())
</script>