<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px" >
            <el-form-item label="项目名" prop="projectName">
                <el-input
                v-model="queryParams.projectName"
                placeholder="请输入项目名"
                clearable
                @keyup.enter.native="handleQuery"
                ></el-input>
            </el-form-item>
            <el-form-item label="开始日期" align="center">
                <el-date-picker
                clearable
                v-model="daterangeStartDate"
                style="width: 240px;"
                value-format="YYYY-MM-DD"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                type="daterange"
                ></el-date-picker>
            </el-form-item>
            <el-form-item label="结束日期" align="center">
                <el-date-picker
                clearable
                v-model="daterangeEndDate"
                style="width: 240px;"
                value-format="YYYY-MM-DD"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                type="daterange"
                ></el-date-picker>
            </el-form-item>
            <el-form-item label="项目状态" prop="status" align="center" style="width: 250px;">
                <el-select v-model="queryParams.status" placeholder="请选择状态" >
                    <el-option
                    v-for="dict in mes_pro_status"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery" style="width: 45px;">搜索</el-button>
                <el-button icon="el-icon-refresh" size="small" @click="resetQuery" style="width: 45px;">重置</el-button>
            </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5" >
                <el-button
                type="primary"
                plain
                icon="el-icon-plus"
                size="small"
                @click="handleAdd"
                style="width: 45px;"
                >新增</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button
                type="success"
                plain
                icon="el-icon-edit"
                size="small"
                :disabled="single"
                @click="handleUpdate"
                style="width: 45px;"
                >修改</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button
                type="danger"
                plain
                icon="el-icon-delete"
                size="small"
                :disabled="multiple"
                @click="handleDel"
                style="width: 45px;"
                >删除</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button
                type="warning"
                plain
                icon="el-icon-download"
                size="small"
                @click="handleExport"
                style="width: 45px;"
                >导出</el-button>
            </el-col>
            <right-toolbar :shhowSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>



        <el-table v-loading="loading" :data="maintanenceList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="编号" align="center" prop="id"/>
            <el-table-column label="项目名" align="center" prop="projectName"/>
            <el-table-column label="负责人" align="center" prop="projectHeader"/>
            <el-table-column label="开始日期" align="center" prop="startDate" width="180">
                <template #default="scope">
                    <span>{{ parseTime(scope.row.startDate, '{y}-{m}-{d}') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="结束日期" align="center" prop="endDate" width="180">
                <template #default="scope">
                    <span>{{ parseTime(scope.row.endDate, '{y}-{m}-{d}') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="项目状态" align="center" prop="status">
                <template #default="scope">
                    <dict-tag  :options="mes_pro_status" :value="scope.row.status"/>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template #default="scope">
                    <el-button
                    type="text"
                    icon="el-icon-edit"
                    size="small"
                    @click="handleUpdate(scope.row)"
                    >修改</el-button>
                    <el-button
                    type="text"
                    icon="el-icon-delete"
                    size="small"
                    @click="handleDel(scope.row)"
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

<el-dialog :title="title" v-model="open" width="500px" append-to-body>
        <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
          <el-form-item label="项目名" prop="projectName">
            <el-input v-model="form.projectName" placeholder="请输入项目名"/>
          </el-form-item>
          <el-form-item label="负责人" prop="projectHeader">
            <el-input v-model="form.projectHeader" placeholder="请输入负责人"/>
          </el-form-item>
          <el-form-item label="开始日期" prop="startDate">
            <el-date-picker
            clearable
            v-model="form.startDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择开始日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="结束日期" prop="endDate">
            <el-date-picker
            clearable
            v-model="form.endDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="项目状态" prop="status">
            <el-select v-model="form.status" placerholder="请选择状态">
              <el-option 
                v-for="dict in mes_pro_status"
                :key="dict.value"
                :label="dict.label"
                :value="parseInt(dict.value)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="项目介绍" prop="introduce">
            <image-upload v-model="form.introduce"></image-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm">确定</el-button>
          <el-button @click="cancel">取消</el-button>
        </div>
      </el-dialog>

    </div>
</template>



<script setup>
import {ref,onMounted,getCurrentInstance} from 'vue'
import { ElMessage,ElMessageBox } from 'element-plus';
import { listMaintanence,getMaintanence,addMaintanence,updateMaintanence,delMaintanence} from '@/api/mes/maintanence.js'
import Pagination from '@/components/Pagination';

const {proxy} = getCurrentInstance()
const {
    mes_pro_status
} = proxy.useDict(
    "mes_pro_status"
)
const loading = ref(true)
const ids = ref([])
const total = ref(0)
const maintanenceList =  ref([])
const title = ref("")
const open = ref(false)
const queryForm = ref(null)
const formRef = ref(null)
const queryParams = ref({
    pageNum:1,
    pageSize:10,
    projectName:null,
    startDate:null,
    endDate:null,
    status:null,
})
const daterangeStartDate = ref([])
const daterangeEndDate = ref([])
const showSearch = ref(true)
const single = ref(true)
const multiple = ref(true)
const form = ref({})
const rules = {
    projectName:[
        {required:true,message:"项目名不为空" ,trigger:"blur"}
    ],
    projectHeader:[
        {required:true,message:"负责人不为空" ,trigger:"blur"}
    ],
    startDate:[
        {required:true,message:"开始日期不为空" ,trigger:"blur"}
    ],
    endDate:[
        {required:true,message:"结束日期不为空" ,trigger:"blur"}
    ],
}
const getList = async (paginationParams) => {
    loading.value = true;
    if(paginationParams){
        queryParams.value.pageNum = paginationParams.page;
        queryParams.value.pageSize = paginationParams.limit
    }
    queryParams.value.params = {};
    if (daterangeStartDate.value && daterangeStartDate.value.length === 2) {
      queryParams.value.params.beginStartDate = daterangeStartDate.value[0];
      queryParams.value.params.endStartDate = daterangeStartDate.value[1];
    }
    if (daterangeEndDate.value && daterangeEndDate.value.length === 2) {
      queryParams.value.params.beginEndDate = daterangeEndDate.value[0];
      queryParams.value.params.endEndDate = daterangeEndDate.value[1];
    }
    const res = await listMaintanence(queryParams.value)
    maintanenceList.value = res.rows
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
        projectName:null,
        projectHeader:null,
        startDate:null,
        endDate:null,
        status:null,
        introduce:null
    }
    if(formRef.value){
        formRef.value.resetFields()
    }
}
const handleQuery = async () => {
    queryParams.value.pageNum = 1
    await getList()
}
const resetQuery = async () => {
    daterangeStartDate.value= ref([])
    daterangeEndDate.value = ref([])
    queryForm.value.resetFields()
    await getList()
}
const handleSelectionChange = async (selection) => {
    ids.value = selection.map(item => item.id)
    single.value = selection.length != 1
    multiple.value = !selection.length
}
const handleAdd = async () => {
    await reset()
    open.value = true
    title.value = "添加项目维护"
}
const handleUpdate = async (row) => {
    await reset()
    const id = row.id || ids.value[0]
    getMaintanence(id).then(res => {
        if(res && res.data){
            form.value = res.data
            open.value =true
            title.value = "修改项目维护"
        }
    })
}
const submitForm = async () => {
    if(formRef.value){
        formRef.value.validate(valid => {
            if(valid){
                if(form.value.id != null){
                    updateMaintanence(form.value).then(res => {
                        ElMessage.success("修改成功")
                        open.value = false
                        getList()
                    })
                }else{
                    addMaintanence(form.value).then(res => {
                        ElMessage.success("新增成功")
                        open.value = false
                        getList()
                    })
                }
            }
        })
    }
}
const handleDel = async (row) => {
    const Ids = row.id || ids.value
    ElMessageBox.confirm('是否确认删除项目维护编号为"'+ Ids + '"的数据',{
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type:'warning'
    }).then(() => {
        return delMaintanence(Ids)
    }).then(() => {
        getList()
        ElMessage.success("删除成功")
    }).catch(() => {})
}
onMounted(() => getList())
</script>
<style scoped>

</style>