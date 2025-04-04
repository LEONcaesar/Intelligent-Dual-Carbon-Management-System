<template>
<div class="app-container">
  <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
    <el-form-item label="计划号" prop="planNumber">
      <el-input
          v-model="queryParams.planNumber"
          placeholder="请输入计划号"
          clearable
          @keyup.enter="handleQuery"
      />
    </el-form-item>
    <el-form-item label="项目" prop="projectId">
      <el-select v-model="queryParams.projectId" placeholder="请选择项目" clearable style="width: 240px">
        <el-option
            v-for="item in maintenanceList"
            :key="item.id"
            :label="item.projectName"
            :value="item.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="名称" prop="name">
      <el-input
          v-model="queryParams.name"
          placeholder="请输入名称"
          clearable
          @keyup.enter="handleQuery"
      />
    </el-form-item>
    <el-form-item label="交货日期" prop="deliveryDate">
      <el-date-picker
          v-model="daterangeDeliveryDate"
          style="width: 240px"
          value-format="YYYY-MM-DD"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
      ></el-date-picker>
    </el-form-item>
    <el-form-item label="申请人" prop="applicant">
      <el-select v-model="queryParams.applicant" clearable style="width: 240px">
        <el-option
            v-for="dict in userList"
            :key="dict.userId"
            :label="dict.userName"
            :value="dict.userId"/>
      </el-select>
    </el-form-item>
    <el-form-item label="申请时间">
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
      <el-select v-model="queryParams.applicantStatus" clearable style="width: 240px">
        <el-option
            v-for="dict in mes_plan_sqstatus"
            :key="dict.value"
            :label="dict.label"
            :value="parseInt(dict.value)"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="审核人" prop="reviewer">
      <el-select v-model="queryParams.reviewer" clearable style="width: 240px">
        <el-option
            v-for="dict in userList"
            :key="dict.userId"
            :label="dict.userName"
            :value="dict.userId"/>
      </el-select>
    </el-form-item>
    <el-form-item label="审核时间">
      <el-date-picker
          v-model="daterangeReviewerDate"
          style="width: 240px"
          value-format="YYYY-MM-DD"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
      ></el-date-picker>
    </el-form-item>
    <el-form-item label="审核状态" prop="reviewerStatus">
      <el-select v-model="queryParams.reviewerStatus" clearable style="width: 240px">
        <el-option
            v-for="dict in mes_plan_shstatus"
            :key="dict.value"
            :label="dict.label"
            :value="parseInt(dict.value)"
        />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleQuery"><el-icon><Search /></el-icon>搜素</el-button>
      <el-button @click="resetQuery"><el-icon><Refresh /></el-icon>重置</el-button>
    </el-form-item>
  </el-form>

  <el-table v-loading="loading" :data="planList" >
    <el-table-column label="编号" align="center" prop="id"/>
    <el-table-column label="计划号" align="center" prop="planNumber"/>
    <el-table-column label="项目" align="center" prop="projectName"/>
    <el-table-column label="名称" align="center" prop="name"/>
    <el-table-column label="交货日期" align="center" prop="deliveryDate" width="180">
      <template #default="scope">
        <span>{{ parseTime(scope.row.deliveryDate, '{y}-{m}-{d}') }}</span>
      </template>
    </el-table-column>
    <el-table-column label="申请人" align="center" prop="applicantName"/>
    <el-table-column label="申请时间" align="center" prop="applicantDate" width="180">
      <template #default="scope">
        <span>{{ parseTime(scope.row.applicantDate, '{y}-{m}-{d}') }}</span>
      </template>
    </el-table-column>
    <el-table-column label="申请状态" align="center" prop="applicantStatus">
      <template #default="scope">
        <dict-tag :options="mes_plan_sqstatus" :value="scope.row.applicantStatus"/>
      </template>
    </el-table-column>
    <el-table-column label="审核人" align="center" prop="reviewerName"/>
    <el-table-column label="审核时间" align="center" prop="reviewerDate" width="180">
      <template #default="scope">
        <span>{{ parseTime(scope.row.reviewerDate, '{y}-{m}-{d}') }}</span>
      </template>
    </el-table-column>
    <el-table-column label="审核状态" align="center" prop="reviewerStatus">
      <template #default="scope">
        <dict-tag :options="mes_plan_shstatus" :value="scope.row.reviewerStatus"/>
      </template>
    </el-table-column>
    <el-table-column label="操作" align="center" class-name="default-padding fixed-width">
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

  <!-- 添加或修改生产计划对话框 -->
  <el-dialog :title="title" v-model="open" width="1000px" append-to-body style="" @open="openEmit">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="计划号" prop="planNumbr">
            <el-input v-model="form.planNumber" placeholder="请输入计划号" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="订单号" prop="saleOrderNo">
            <el-input v-model="form.saleOrderNo" placeholder="请选择订单" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入名称" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="交货日期" prop="deliveryDate">
            <el-date-picker
                clearable
                v-model="form.deliveryDate"
                type="date"
                disabled
                value-format="yyyy-MM-dd"
                placeholder="请选择交货日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="项目" prop="projectId">
            <el-select v-model="form.projectId" placeholder="请选择项目" clearable disabled>
              <el-option
                  v-for="item in maintenanceList"
                  :key="item.id"
                  :label="item.projectName"
                  :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" placeholder="请输入备注" disabled/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="申请人" prop="applicant">
            <el-select v-model="form.applicant" disabled>
              <el-option
                  v-for="dict in userList"
                  :key="dict.userId"
                  :label="dict.userName"
                  :value="dict.userId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="申请时间" prop="applicantDate">
            <el-date-picker
                clearable
                v-model="form.applicantDate"
                type="date"
                value-format="yyyy-MM-dd"
                disabled>
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="申请状态" prop="applicantStatus">
            <el-select v-model="form.applicantStatus" disabled>
              <el-option
                  v-for="dict in mes_plan_sqstatus"
                  :key="dict.value"
                  :label="dict.label"
                  :value="parseInt(dict.value)"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="审核人" prop="reviewer">
            <el-select v-model="form.reviewer" disabled>
              <el-option
                  v-for="dict in userList"
                  :key="dict.userId"
                  :label="dict.userName"
                  :value="dict.userId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="审核时间" prop="reviewerDate">
            <el-date-picker
                clearable
                v-model="form.reviewerDate"
                type="date"
                disabled
                value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="审核状态" prop="reviewerStatus">
            <el-select v-model="form.reviewerStatus" disabled>
              <el-option
                  v-for="dict in mes_plan_shstatus"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="审核意见" prop="reviewComments">
            <el-input v-model="form.reviewComments" placeholder="请输入审核意见"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider content-position="center">生产计划明细信息</el-divider>
      <el-table :data="mesProductionPlanItemList"  ref="mesProductionPlanItem">
        <el-table-column label="序号" align="center" type="index" width="50"/>
        <el-table-column label="产品" prop="materialName" width="150">
          <template #default="scope">
            <el-input v-model="scope.row.materialName" disabled/>
          </template>
        </el-table-column>
        <el-table-column label="型号" prop="materialModel" width="150">
          <template #default="scope">
            <el-input v-model="scope.row.materialModel" disabled/>
          </template>
        </el-table-column>
        <el-table-column label="规格" prop="materialSpecifications" width="150">
          <template #default="scope">
            <el-input v-model="scope.row.materialSpecifications" disabled/>
          </template>
        </el-table-column>
        <el-table-column label="单位" prop="materialUnit" width="150">
          <template #default="scope">
            <el-input v-model="scope.row.materialUnit" disabled/>
          </template>
        </el-table-column>
        <el-table-column label="生产数量" prop="quantity" width="150">
          <template #default="scope">
            <el-input v-model="scope.row.quantity" placeholder="请输入生产数量"  disabled/>
          </template>
        </el-table-column>
        <el-table-column label="生产日期" prop="manufacture" width="240">
          <template #default="scope">
            <el-date-picker clearable v-model="scope.row.manufacture" type="date" value-format="yyyy-MM-dd"
                            placeholder="请选择生产日期" disabled/>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button v-if="form.applicantStatus === 1" type="primary" @click="submitForm(1)">通 过</el-button>
        <el-button v-if="form.applicantStatus === 1" type="primary" @click="submitForm(0)">驳 回</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</div>
</template>


<script setup>
import { getMaintenance, listPlan, getPlan, approvePlan } from '@/api/mytask/plan.js'
import { getUserList } from '@/api/system/user'
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const { proxy } = getCurrentInstance()
const {
  mes_plan_sqstatus,
  mes_plan_shstatus,
} = proxy.useDict(
    "mes_plan_sqstatus",
    "mes_plan_shstatus",
)

// 遮罩层
const loading = ref(false)
// 用户列表
const userList = ref([])
// 生产计划id时间范围
const daterangeApplicantDate = ref([])
// 生产计划id时间范围
const daterangeReviewerDate = ref([])
// 交货日期时间范围
const daterangeDeliveryDate = ref([])
// 查询参数
const queryParams = ref({
  pageNum: 1,
  pageSize: 10,
  planNumbr: null,
  projectId: null,
  name: null,
  deliveryDate: null,
  applicant: null,
  applicantDate: null,
  applicantStatus: 1,
  reviewer: null,
  reviewerDate: null,
  reviewerStatus: null,
})
const maintenanceList = ref([])
// 生产计划表格数据
const planList = ref([])
// 总条数
const total = ref(0)

const getList = async () => {
  const userRes = await getUserList()
  userList.value = userRes.data
  const maintenanceRes = await getMaintenance()
  maintenanceList.value = maintenanceRes.data
  loading.value = true
  queryParams.value.params = {}
  if (null != daterangeApplicantDate.value && '' != daterangeApplicantDate.value) {
    queryParams.value.params["beginApplicantDate"] = daterangeApplicantDate.value[0]
    queryParams.value.params["endApplicantDate"] = daterangeApplicantDate.value[1]
  }
  if (null != daterangeReviewerDate.value && '' != daterangeReviewerDate.value) {
    queryParams.value.params["beginReviewerDate"] = daterangeReviewerDate.value[0];
    queryParams.value.params["endReviewerDate"] = daterangeReviewerDate.value[1];
  }
  if (null != daterangeDeliveryDate.value && '' != daterangeDeliveryDate.value) {
    queryParams.value.params["beginDeliveryDate"] = daterangeDeliveryDate.value[0];
    queryParams.value.params["endDeliveryDate"] = daterangeDeliveryDate.value[1];
  }

  const planRes = await listPlan(queryParams.value)
  planList.value = planRes.rows
  total.value = planRes.total
  loading.value = false

}
onMounted(() => getList())

const queryFormRef = ref()
const handleQuery = () => {
  queryParams.value.pageNum = 1
  getList()
}
const resetQuery = () => {
  daterangeApplicantDate.value = []
  daterangeReviewerDate.value = []
  daterangeDeliveryDate.value = []
  queryFormRef.value.resetFields()
  handleQuery()
}


//======弹层======
const form = ref({})
const formRef = ref()
const rules = ref()
const open = ref(false)
const title = ref('')
const mesProductionPlanItemList = ref()

const reset = () => {
  form.value = {
    id: null,
    planNumber: null,
    projectId: null,
    name: null,
    saleOrderId: null,
    saleOrderNo: null,
    deliveryDate: null,
    remark: null,
    reviewComments: null
  }
  mesProductionPlanItemList.value = []
}
const openEmit = () => {
  formRef.value.resetFields()
}

/** 详情按钮操作 */
const handleUpdate = async (row) => {
  reset()
  const id = row.id || this.ids
  const res = await getPlan(id)
  form.value = res.data
  mesProductionPlanItemList.value = res.data.mesProductionPlanItemList
  open.value = true
  title.value = "生产计划详情"
}
const submitForm = async (status) => {
  form.value.reviewerStatus = status
  await approvePlan(form.value)
  ElMessage.success('审核成功')
  open.value = false
  await getList()
}
const cancel = () => {
  open.value = false
  reset()
}

</script>