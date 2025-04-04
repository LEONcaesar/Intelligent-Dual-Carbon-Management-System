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
          <el-select v-model="queryParams.customerId" placeholder="请选择" clearable style="width: 150px;">
            <el-option
              v-for="dict in customList"
              :key="dict.id"
              :label="dict.customName"
              :value="dict.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="申请人" prop="applicant">
          <el-select v-model="queryParams.applicant" clearable filterable style="width: 150px;">
            <el-option v-for="dict in userList" :key="dict.userId" :label="dict.userName"
                       :value="dict.userId"></el-option>
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
        <el-form-item label="审核人" prop="approved">
          <el-select v-model="queryParams.approved" clearable filterable style="width: 150px;"> 
            <el-option v-for="dict in userList" :key="dict.userId" :label="dict.userName"
                       :value="dict.userId"></el-option>
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
        <el-form-item label="业务类型" prop="businessType">
          <el-select v-model="queryParams.businessType" placeholder="请选择业务类型" clearable style="width: 150px;">
            <el-option
              v-for="dict in wms_ountbound_application_type"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="合同类型" prop="contractType">
          <el-select v-model="queryParams.contractType" placeholder="请选择合同类型" clearable style="width: 150px;"> 
            <el-option
              v-for="dict in wms_outbound_application_order_type"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="申请状态" prop="applicationStatus">
          <el-select v-model="queryParams.applicationStatus" placeholder="请选择申请状态" clearable style="width: 150px;">
            <el-option
              v-for="dict in wms_outbound_application_application_status"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="审核状态" prop="approvedStatus">
          <el-select v-model="queryParams.approvedStatus" placeholder="请选择审核状态" clearable style="width: 150px;">
            <el-option
              v-for="dict in wms_outbound_application_approved_status"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="单据状态" prop="documentStatus">
          <el-select v-model="queryParams.documentStatus" placeholder="请选择单据状态" clearable style="width: 150px;">
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
  
  
      <el-table v-loading="loading" :data="outboundApplicationList" >
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
  
      <!-- 出库申请对话框 -->
      <el-dialog :title="title" v-model="open" width="1000px" append-to-body>
        <el-form ref="formRef" :model="form" :rules="rules" label-width="95px" :inline="true">
          <el-form-item label="业务类型" prop="businessType">
            <el-select v-model="form.businessType" placeholder="请选择业务类型" clearable filterable disabled>
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
                <el-button   disabled>选择</el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="单据号" prop="documentNo">
            <el-input v-model="form.documentNo" disabled/>
          </el-form-item>
          <el-form-item v-if="form.businessType=='2'" label="客户" prop="customerId">
            <el-select v-model="form.customerId" placeholder="请选择客户" clearable filterable disabled>
              <el-option v-for="item in customList" :key="item.id" :label="item.customName"
                         :value="parseInt(item.id)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="form.businessType=='2'" label="合同编号" prop="contractNo">
            <el-input v-model="form.contractNo" placeholder="" disabled/>
          </el-form-item>
          <el-form-item v-if="form.businessType=='2'" label="合同类型" prop="contractType" disabled>
            <el-select v-model="form.contractType" placeholder="请选择" clearable filterable disabled>
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
            <el-input v-model="form.approvedComments" type="textarea" placeholder="" />
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" disabled/>
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
          <el-table :data="wmsOutboundApplicationDetailsList" :row-class-name="rowWmsOutboundApplicationDetailsIndex" ref="wmsOutWarehouseApplyDetail">
            <el-table-column type="selection" width="50" align="center"/>
            <el-table-column label="序号" align="center" prop="index" width="50"/>
            <el-table-column label="物料" prop="materialName" width="300">
              <template #default="scope">
                <el-form-item :prop="'wmsOutboundApplicationDetailsList.'+scope.$index+'.materialName'"
                              :rules="rules.materialName">
                  <el-input v-model="scope.row.materialName" placeholder="请选择物料" disabled>
                  </el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="仓库" prop="warehouseId" width="200">
              <template #default="scope">
                <el-form-item :prop="'wmsOutboundApplicationDetailsList.'+scope.$index+'.warehouseId'">
                  <el-select v-model="scope.row.warehouseId" placeholder="请选择仓库" disabled style="width:150px">
                    <el-option v-for="dict in warehouseList" :key="dict.id" :label="dict.warehouseName" :value="dict.id"></el-option>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="库区" prop="warehouseAreaId" width="200">
              <template #default="scope">
                <el-form-item :prop="'wmsOutboundApplicationDetailsList.'+scope.$index+'.warehouseAreaId'">
                  <el-select v-model="scope.row.warehouseAreaId" placeholder="请选择库区"  disabled style="width:150px">
                    <el-option v-for="dict in scope.row.wmsWarehouseAreaList" :key="dict.id" :label="dict.areaName" :value="dict.id"/>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="库位" prop="warehouseSeatId" width="200">
              <template #default="scope">
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
                              :rules="rules.outboundNumber">
                  <el-input v-model.number="scope.row.outboundNumber" placeholder="" disabled/>
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
          <el-button  v-if="form.applicationStatus=='1'" type="primary" @click="submitForm(1)">通 过
          </el-button>
          <el-button  v-if="form.applicationStatus=='1'" type="primary" @click="submitForm(0)">驳 回
          </el-button>
          <el-button  @click="cancel">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </template>
  
  
  <script setup>
  import { ref, onMounted,getCurrentInstance} from 'vue';
  import {
    listOutboundApplication,
    getOutboundApplication,
    listUser,
    subOutboundApplication,
    outboundApplication,
  } from '@/api/wms/outboundApplication';
  import { listCustom } from '@/api/wms/carrierApplication';
  import { listWarehouse } from '@/api/wms/warehousingApplication';
  import { getApply } from '@/api/mes/apply';
  import { getDelivery } from '@/api/scm/delivery';
import { ElMessage } from 'element-plus';
import Pagination from '@/components/Pagination'
  const {proxy} = getCurrentInstance()
  const {
    wms_ountbound_application_type,
    wms_outbound_application_order_type,
    wms_application_type,
    wms_outbound_application_status,
    wms_outbound_application_application_status,
    wms_outbound_application_approved_status
  } = proxy.useDict(
    "wms_ountbound_application_type",
    "wms_outbound_application_order_type",
    "wms_application_type",
    "wms_outbound_application_status",
    "wms_outbound_application_application_status",
    "wms_outbound_application_approved_status"
  )
  
      // 响应式数据
      const loading = ref(true);
      const showSearch = ref(true);
      const total = ref(0);
      const outboundApplicationList = ref([]);
      const wmsOutboundApplicationDetailsList = ref([]);
      const open = ref(false);
      const title = ref('');
      const applyOpen = ref(false)
      const deliveryOpen = ref(false)
      const daterangeApplicationDate = ref([]);
      const daterangeApprovedDate = ref([]);
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
        approvedStatus: null,
      });
      const form = ref({});
      const formRef = ref(null)
      const queryForm = ref(null)
      const userList = ref([]);
      const customList = ref([]);
      const warehouseList = ref([]);
      const associationList = ref([]);
      const rules = {
        associationDocumentNo: [
          { required: true, message: "关联单据号不能为空", trigger: "blur" }
        ],
        businessType: [
          { required: true, message: "业务类型不能为空", trigger: "blur" }
        ],
        materialName: [
          { required: true, message: "物料不能为空", trigger: "blur" }
        ],
        outboundNumber: [
          { required: true, message: "出库数量不能为空", trigger: "blur" },
          { type: 'number', message: '出库数量必须为数字值' },
        ]
      }
      // 方法
      const getList = async (paginationParams) => {
        loading.value = true;
        if(paginationParams){
          queryParams.value.pageNum = paginationParams.page
          queryParams.value.pageSize = paginationParams.limit
        }
        
        queryParams.params = {};
        if (daterangeApplicationDate.value && daterangeApplicationDate.value.length === 2) {
          queryParams.params['beginApplicationDate'] = daterangeApplicationDate.value[0];
          queryParams.params['endApplicationDate'] = daterangeApplicationDate.value[1];
        }
        if (daterangeApprovedDate.value && daterangeApprovedDate.value.length === 2) {
          queryParams.params['beginApprovedDate'] = daterangeApprovedDate.value[0];
          queryParams.params['endApprovedDate'] = daterangeApprovedDate.value[1];
        }
        listUser().then((response) => (userList.value = response.data));
        listCustom().then((response) => (customList.value = response.data));
        listWarehouse().then((response) => (warehouseList.value = response.data));
        const response = await listOutboundApplication(queryParams.value);
        outboundApplicationList.value = response.rows;
        total.value = response.total;
        loading.value = false;
      };
  
      const reset = async () => {
        form.value= {
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
        }
        associationList.value = [];
        wmsOutboundApplicationDetailsList.value = [];
      };
  
      const handleQuery = async () => {
        queryParams.value.pageNum = 1
        getList();
      };
  
      const resetQuery = async ()  => {
        queryForm.value.resetFields()
        daterangeApplicationDate.value = [];
        daterangeApprovedDate.value = [];
        handleQuery();
      };
  
      const handleUpdate = async (row) => {
        reset();
        const id = row.id || isValidDatePickType.value
        getOutboundApplication(id).then(res => {
          form.value = res.data
          console.log(res.data)
          if(res.data.businessType ==1 ){
            selectApply(res.data.documentNoId)
          }else if(res.data.businessType == 2 ){
            selectDelivery(res.data.documentNoId)
          }
        
        wmsOutboundApplicationDetailsList.value = res.data.wmsOutboundApplicationDetailsList;
        open.value = true;
        title.value = '修改出库申请';
      })
      };
  
      const submitForm = async (status) => {
        form.value.approvedStatus = status;
        await outboundApplication(form);
        ElMessage.success("审核成功")
        open.value = false;
        getList();
      };
  
      const selectApply = async (val) => {
        const response = await getApply(val.id ? val.id : val);
        form.value.associationDocumentNo = response.data.oddNumber;
        form.value.documentNoId = response.data.id;
        associationList.value = response.data.mesMaterialApplyItemList
        associationList.value.map(item => {
          item.deliveryNo = item.dosage
        })
        applyOpen.value = false
      };
      
  
      const selectDelivery = async (val) => {
        const response = await getDelivery(val.id ? val.id : val);
        form.value.associationDocumentNo = response.data.deliveryNo;
        form.value.documentNoId = response.data.id;
        associationList.value = response.data.scmSaleDeliveryItemList;
        form.value.customerId = parseInt(response.data.customId);
        form.value.contractNo = response.data.contractNo;
        form.value.contractType = 2;
        deliveryOpen.value = false
      };
      const rowWmsOutboundApplicationDetailsIndex = async ({row,rowIndex}) => {
        row.index = rowIndex +1
      }
      const cancel = async () => {
        reset()
        open.value = false
      }
      // 生命周期钩子
      onMounted(() => {
        getList();
        
      })
     
  </script>