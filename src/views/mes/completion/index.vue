<template>
    <div class="app-container">
      <el-form :model="queryParams" ref="queryForm" size="default" :inline="true"  label-width="68px">
        <el-form-item label="生产计划" prop="planNumber">
          <el-input
            v-model="queryParams.planNumber"
            placeholder="请输入生产计划"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="生产作业" prop="jobName">
          <el-input
            v-model="queryParams.jobName"
            placeholder="请输入生产作业"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="产品" prop="materialName">
          <el-input
            v-model="queryParams.materialName"
            placeholder="请输入产品"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="完工日期">
          <el-date-picker
            v-model="daterangeCompletionDate"
            style="width: 240px"
            value-format="YYYY-MM-DD"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="生产批号" prop="batchNumber">
          <el-input
            v-model="queryParams.batchNumber"
            placeholder="请输入生产批号"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="请选择状态" clearable style="width: 250px;">
            <el-option
              v-for="dict in mes_production_completion_status"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"@click="handleQuery"><el-icon><Search/></el-icon>搜索</el-button>
          <el-button  @click="resetQuery"><el-icon><Refresh/></el-icon>重置</el-button>
        </el-form-item>
      </el-form>
  
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="success"
            plain
            :disabled="single"
            @click="handleUpdate"
          ><el-icon><Edit/></el-icon>修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            :disabled="multiple"
            @click="handleDelete"
          ><el-icon><Delete/></el-icon>删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            @click="handleExport"
          ><el-icon><Warning/></el-icon>导出</el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>
  
      <el-table v-loading="loading" :data="completionList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="编号" align="center" prop="id" />
        <el-table-column label="单号" align="center" prop="oddNumbers" />
        <el-table-column label="生产计划" align="center" prop="planNumber" />
        <el-table-column label="生产作业" align="center" prop="jobName" />
        <el-table-column label="产品" align="center" prop="materialName" />
        <el-table-column label="型号" align="center" prop="materialModel" />
        <el-table-column label="规格" align="center" prop="materialSpecifications" />
        <el-table-column label="单位" align="center" prop="materialUnit" />
        <el-table-column label="完工日期" align="center" prop="completionDate" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.completionDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="生产数量" align="center" prop="quantity" />
        <el-table-column label="生产批号" align="center" prop="batchNumber" />
        <el-table-column label="状态" align="center" prop="status">
          <template #default="scope">
            <dict-tag :options="mes_production_completion_status" :value="scope.row.status"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button
              v-if="scope.row.status == 0"
              size="small"
              type="text"
              @click="handleStatus(scope.row, 3)"
            >检验合格</el-button>
            <el-button
              v-if="scope.row.status == 0"
              size="small"
              type="text"
              @click="handleStatus(scope.row, 4)"
            >检验未合格</el-button>
            <el-button
              size="small"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
            >修改</el-button>
            <el-button
              size="small"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
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
  
      <!-- 添加或修改生产完工单对话框 -->
      <el-dialog :title="title" v-model="open" width="1000px" append-to-body>
        <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
          <el-form-item label="单号" prop="oddNumbers">
            <el-input v-model="form.oddNumbers" disabled/>
          </el-form-item>
          </el-col>
          <el-col :span="12">
          <el-form-item label="生产计划" prop="planNumber">
            <el-input v-model="form.planNumber" disabled/>
          </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
          <el-form-item label="生产作业" prop="jobName">
            <el-input v-model="form.jobName" disabled/>
          </el-form-item>
          </el-col>
          <el-col :span="12">
          <el-form-item label="产品" prop="materialName">
            <el-input v-model="form.materialName" disabled/>
          </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
          <el-form-item label="型号" prop="materialModel">
            <el-input v-model="form.materialModel" disabled/>
          </el-form-item>
          </el-col>
          <el-col :span="12">
          <el-form-item label="规格" prop="materialSpecifications">
            <el-input v-model="form.materialSpecifications" disabled/>
          </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
          <el-form-item label="单位" prop="materialUnit">
            <el-input v-model="form.materialUnit" disabled/>
          </el-form-item>
          </el-col>
          <el-col :span="12">
          <el-form-item label="完工日期" prop="completionDate">
            <el-date-picker
              clearable
              v-model="form.completionDate"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="请选择完工日期"
              disabled>
            </el-date-picker>
          </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
          <el-form-item label="生产数量" prop="quantity">
            <el-input v-model="form.quantity" disabled/>
          </el-form-item>
          </el-col>
          <el-col :span="12">
          <el-form-item label="生产批号" prop="batchNumber">
            <el-input v-model="form.batchNumber" placeholder="请输入生产批号" />
          </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
            <el-select v-model="form.status" placeholder="请选择状态" disabled>
              <el-option
                v-for="dict in mes_production_completion_status"
                :key="dict.value"
                :label="dict.label"
                :value="parseInt(dict.value)"
              ></el-option>
            </el-select>
          </el-form-item>
          </el-col>
          <el-col :span="12">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" placeholder="请输入备注" />
          </el-form-item>
          </el-col>
        </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </template>
  


<script setup>
import { listCompletion, getCompletion, delCompletion, addCompletion, updateCompletion } from "@/api/mes/completion.js";
import {ref , onMounted , getCurrentInstance} from 'vue'
import Pagination from '@/components/Pagination'
import { ElMessage,ElMessageBox } from "element-plus";
const {proxy} = getCurrentInstance()
const {
    mes_production_completion_status
} = proxy.useDict(
    "mes_production_completion_status"
)
const loading = ref(true)
const ids = ref([])
const total = ref(0)
const completionList = ref([])
const title = ref("")
const open = ref(false)
const queryForm = ref(null)
const formRef = ref(null)
const queryParams = ref({
    pageNum:1,
    pageSize:10,
    planNumber:null,
    jobName:null,
    materialName:null,
    completionDate:null,
    batchNumber:null,
    status:null
})
const form = ref({})
const daterangeCompletionDate = ref([])
const single= ref(true)
const multiple = ref(true)
const showSearch = ref(true)
const rules = {
    batchNumber:[{required:true,message:"生产批次不能为空",trigger:"blur"}]
}
const getList = async (paginationParams) => {
    loading.value = true
    if(paginationParams){
        queryParams.value.pageNum = paginationParams.page
        queryParams.value.pageSize = paginationParams.limit
    }
    queryParams.value.params = {}
    if(daterangeCompletionDate.value && daterangeCompletionDate.value === 2){
        queryParams.value.params.beginCompletionDate = daterangeCompletionDate.value[0]
        queryParams.value.params.endCompletionDate = daterangeCompletionDate.value[1]

    }
    const res = await listCompletion(queryParams.value)
    completionList.value = res.rows
    total.value=res.total
    loading.value=false

}
const cancel = async () => {
    open.value = false
    reset()
}
const reset = async () => {
    form.value={
        id:null,
        oddNumbers:null,
        batchNumber:null,
        remark:null
    }
    if(formRef.value){
        formRef.value.resetFields()
    }
}
const resetQuery = async () => {
    daterangeCompletionDate.value = ref([])
    queryForm.value.resetFields()
    await getList()
}
const handleQuery = async () => {
    queryParams.value.pageNum =1 
    await getList()
}
const handleSelectionChange = async (selection) => {
    ids.value = selection.map(item => item.id)
    single.value = selection.length != 1
    multiple.value = !selection.length
}
const handleUpdate = async (row) => {
    reset()
    const id = row.id || ids.value[0]
    getCompletion(id).then(res => {
        if(res && res.data){
            form.value = res.data
            open.value = true
            title.value = "修改生产完工单"
        }
    })
}
const handleStatus = async (row,status) => {
    updateCompletion({id:row.id,status:status}).then(res => {
        ElMessage.success("提交成功")
        getList()
    })
}
const submitForm =async () => {
    if(formRef.value){
        formRef.value.validate(valid => {
            if(valid){
                if(form.value.id != null){
                    updateCompletion(form.value).then(res => {
                        ElMessage.success("修改成功")
                        open.value = false
                        getList()
                    })
                }else{
                    addCompletion(form.value).then(res => {
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
    ElMessageBox.confirm('是否确认删除生产完工单编号为"'+ Ids +'"的数据项？',{
        confirmButtonText:'确定',
        cancelButtonText:'取消'
    }).then(() => {
        return delCompletion(Ids)
    }).then(() => {
        getList()
        ElMessage.success("删除成功")
    }).catch(() => {})
}
onMounted(() => getList())
</script>