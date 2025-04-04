<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="设备名称" prop="deviceName">
        <el-input
        style="border: 1px solid #dcdfe6; border-radius: 5px;"
          v-model="queryParams.deviceName"
          placeholder="请输入设备名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="设备编码" prop="deviceCode">
        <el-input
        style="border: 1px solid #dcdfe6; border-radius: 5px;"
          v-model="queryParams.deviceCode"
          placeholder="请输入设备编码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="设备型号" prop="deviceModel">
        <el-input
        style="border: 1px solid #dcdfe6; border-radius: 5px;"
          v-model="queryParams.deviceModel"
          placeholder="请输入设备型号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="生产日期" >
        <el-date-picker clearable
          v-model="daterangeProduceDate"
          style="width: 240px;"
          type="daterange"
          value-format="YYYY-MM-DD"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"

          >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="生产批号" prop="produceCode">
        <el-input
        style="border: 1px solid #dcdfe6; border-radius: 5px;"
          v-model="queryParams.produceCode"
          placeholder="请输入生产批号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="制造商" prop="manufacturer">
        <el-input
        style="border: 1px solid #dcdfe6; border-radius: 5px;"
          v-model="queryParams.manufacturer"
          placeholder="请输入制造商"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="设备状态" prop="deviceStatus" align="center" style="width: 220px;">
        <el-select v-model="queryParams.deviceStatus" placeholder="请选择设备状态">
          <el-option
          v-for="dict in mes_device_status"
          :key="dict.value"
          :value="dict.value"
          :label="dict.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery" style="width: 45px;">搜索</el-button>
        <el-button icon="el-icon-refresh" size="small" @click="resetQuery" style="width: 45px;">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          style="width: 45px;"
          type="primary"
          plain
          icon="el-icon-plus"
          size="small"
          @click="handleAdd"

        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          style="width: 45px;"
          type="success"
          plain
          icon="el-icon-edit"
          size="small"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:information:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          style="width: 45px;"
          type="danger"
          plain
          icon="el-icon-delete"
          size="small"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:information:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          style="width: 45px;"
          type="warning"
          plain
          icon="el-icon-download"
          size="small"
          @click="handleExport"
          v-hasPermi="['system:information:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="informationList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="编号" align="center" prop="id" />
      <el-table-column label="设备名称" align="center" prop="deviceName" />
      <el-table-column label="设备编码" align="center" prop="deviceCode" />
      <el-table-column label="设备型号" align="center" prop="deviceModel" />
      <el-table-column label="生产日期" align="center" prop="produceDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.produceDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="生产批号" align="center" prop="produceCode" />
      <el-table-column label="制造商" align="center" prop="manufacturer" />
      <el-table-column label="设备状态" align="center" prop="deviceStatus" >
        <template #default="scope">
          <dict-tag :options="mes_device_status" :value="scope.row.deviceStatus"></dict-tag>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            size="small"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:information:edit']"
          >修改</el-button>
          <el-button
            size="small"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:information:remove']"
          >删除</el-button>
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

    <!-- 添加或修改制造执行MES-设备信息对话框 -->
    <el-dialog :title="title" :model-value="open" width="500px" append-to-body>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="设备名称" prop="deviceName">
          <el-input v-model="form.deviceName" placeholder="请输入设备名称" />
        </el-form-item>
        <el-form-item label="设备编码" prop="deviceCode">
          <el-input v-model="form.deviceCode" placeholder="请输入设备编码" />
        </el-form-item>
        <el-form-item label="设备型号" prop="deviceModel">
          <el-input v-model="form.deviceModel" placeholder="请输入设备型号" />
        </el-form-item>
        <el-form-item label="生产日期" prop="produceDate">
          <el-date-picker clearable
            v-model="form.produceDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择生产日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="生产批号" prop="produceCode">
          <el-input v-model="form.produceCode" placeholder="请输入生产批号" />
        </el-form-item>
        <el-form-item label="制造商" prop="manufacturer">
          <el-input v-model="form.manufacturer" placeholder="请输入制造商" />
        </el-form-item>
        <el-form-item label="设备状态" prop="deviceStatus">
          <el-select v-model="form.deviceStatus" placeholder="请选择设备状态">
            <el-option
            v-for="dict in mes_device_status"
            :key="dict.value"
            :label="dict.label"
            :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import {listInformation,getInformation,addInformation,updateInformation,delInformation} from '@/api/mes/information.js'
import {ElMessage,ElMessageBox} from "element-plus"
import Pagination from '@/components/Pagination'
import { getCurrentInstance, onMounted , ref } from 'vue'

const {proxy} = getCurrentInstance()
const {
  mes_device_status
} = proxy.useDict(
  "mes_device_status"
)
const loading = ref(true)
const ids = ref([])
const total = ref(0)
const informationList = ref([])
const title = ref("")
const open = ref(false)
const queryForm = ref(null)
const formRef  = ref(null)
const queryParams = ref({
  pageNum:1,
  pageSize:10,
  deviceName:null,
  deviceCode:null,
  deviceModel:null,
  produceDate:null,
  produceCode:null,
  manufacturer:null,
  deviceStatus:null,
})
const daterangeProduceDate = ref([])
const showSearch = ref(true)
const single = ref(true)
const multiple = ref(true)
const form = ref({})
const rules = {
  deviceName:[
    {required:true,message:"设备名称不为空",trigger:"blur"}
  ]
}
const getList = async (paginationParams) => {
  loading.value = true
  if(paginationParams){
    queryParams.value.pageNum = paginationParams.page
    queryParams.value.pageSize = paginationParams.limit
  }
  queryParams.value.params = {}
  if(daterangeProduceDate.value && daterangeProduceDate.value.length === 2){
  queryParams.value.params.beginProduceDate = daterangeProduceDate.value[0]
  queryParams.value.params.endProduceDate = daterangeProduceDate.value[1]
  }
  const res = await listInformation(queryParams.value)
  informationList.value = res.rows
  total.value = res.total
  loading.value = false
}
const cancel = async () => {
  open.value = false
  reset()
}
const reset = async () => {
  form.value = {
    id:null,
    deviceName:null,
    deviceCode:null,
    deviceModel:null,
    produceDate:null,
    produceCode:null,
    manufacturer:null,
    deviceStatus:null,
    mark:null
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
  daterangeProduceDate.value = ref([])
  queryForm.value.resetFields()
  getList()
}
const handleSelectionChange = async (selection) => {
  ids.value = selection.map(item => item.id)
  single.value = selection.length != 1
  multiple.value = !selection.length
}
const handleAdd = async () => {
  reset()
  open.value = true
  title.value = "添加设备信息"
}
const handleUpdate = async (row) => {
  reset()
  const id =row.id || ids.value[0]
  getInformation(id).then(res => {
    if(res && res.data){
      form.value = res.data
      open.value = true
      title.value = "修改设备信息"
    }
  })
}
const submitForm = async () => {
  if(formRef.value){
    formRef.value.validate(valid => {
      if(valid){
        if(form.value.id != null){
          updateInformation(form.value).then(res => {
            ElMessage.success("修改成功")
            open.value = false
            getList()
          })
        }else{
          addInformation(form.value).then(res => {
            ElMessage.success("新增成功")
            open.value = false
            getList()
          })
        }
      }
    })
  }
}
const handleDelete = async (row) => {
  const Ids = row.id || ids.value
  ElMessageBox.confirm('是否确认删除设备信息编号为"'+ Ids + '"的数据',{
    confirmButtonText:'确认',
    cancelButtonText:'取消',
    type:'warning'
  }).then(() => {
    return delInformation(Ids)
  }).then(() => {
    getList()
    ElMessage.success("删除成功")
  }).catch(() => {})
}
onMounted(() => getList())
</script>
