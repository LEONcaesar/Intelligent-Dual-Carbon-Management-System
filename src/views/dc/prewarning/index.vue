<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px">
        <el-form-item label="检测点名称" prop="pointsName">
          <el-input
            v-model="queryParams.pointsName"
            placeholder="请输入检测点名称"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="检测点地址" prop="pointsAddress">
          <el-input
            v-model="queryParams.pointsAddress"
            placeholder="请输入检测点地址"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status" style="width: 250px;">
          <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
            <el-option
            v-for="dict in dc_prewarning"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"  @click="handleQuery" style="width: 45px;">搜索</el-button>
          <el-button  @click="resetQuery" style="width: 45px;">重置</el-button>
        </el-form-item>
      </el-form>
  
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            @click="handleAdd"
          ><el-icon><Plus/></el-icon>新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            plain
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['dc:prewarning:edit']"
          ><el-icon><Edit/></el-icon>修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['dc:prewarning:remove']"
          ><el-icon><Delete /></el-icon>删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            @click="handleExport"
            v-hasPermi="['dc:prewarning:export']"
          ><el-icon><Warning/></el-icon>导出</el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

  
  
  
  
      <el-table v-loading="loading" :data="prewarningList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55px" align="center"/>
        <el-table-column label="编号" align="center" prop="id"/>
        <el-table-column label="检测点名称" align="center" prop="pointsName"/>
        <el-table-column label="检测点地址" align="center" prop="pointsAddress"/>
        <el-table-column label="实时功率" align="center" prop="realTimePower"/>
        <el-table-column label="实时电压" align="center" prop="realTimeVolt"/>
        <el-table-column label="状态" align="center" prop="status">
          <template #default="scope">
            <dict-tag :options="dc_prewarning" :value="scope.row.status"/>
          </template>
        </el-table-column>
        <el-table-column label="上报时间" align="center" prop="reportTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.reportTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="mark"/>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template #default="scope">
              <el-button 
              size="small" 
              type="text" 
              icon="el-icon-edit" 
              @click="handleUpdate(scope.row)" 
              v-hasPermi="['dc:prewarning:edit']"
              >修改</el-button>
              <el-button
              size="small"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['dc:prewarning:remove']"
            >删除</el-button>
            </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
  
  
      <el-dialog :title="title" v-model="open" width="500px" append-to-body>
          <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
            <el-form-item label="检测点名称" prop="pointsName">
              <el-input v-model="form.pointsName" placeholder="请输入检测点名称"/>
            </el-form-item>
            <el-form-item label="检测点地址" prop="pointsAddress">
              <el-input v-model="form.pointsAddress" placeholder="请输入检测点地址"/>
            </el-form-item>
            <el-form-item label="实时功率" prop="realTimePower">
              <el-input v-model="form.realTimePower" placeholder="请输入实时功率"/>
            </el-form-item>
            <el-form-item label="实时电压" prop="realTimeVolt">
              <el-input v-model="form.realTimeVolt" placeholder="请输入实时电压"/>
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-select v-model="form.status" placerholder="请选择状态">
                <el-option 
                  v-for="dict in dc_prewarning"
                  :key="dict.value"
                  :label="dict.label"
                  :value="parseInt(dict.value)"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="上报时间" prop="reportTime">
              <el-date-picker
              clearable
              v-model="form.reportTime"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="请选择上报时间"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="备注" prop="mark">
              <el-input v-model="form.mark" placeholder="请输入备注"></el-input>
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
import {ref,onMounted, getCurrentInstance} from 'vue'
import {ElMessage , ElMessageBox} from 'element-plus'
import {listPrewarning , getPrewarning,addPrewarning,updatePrewarning,delPrewarning} from '@/api/dc/prewarning.js'
import Pagination from '@/components/Pagination';
const {proxy} = getCurrentInstance()
const {
    dc_prewarning
} = proxy.useDict(
    "dc_prewarning"
)
const loading = ref(true)
const ids = ref([])
const total = ref(0)
const prewarningList = ref([])
const title = ref("")
const open = ref(false)
const queryForm = ref(null)
const formRef = ref(null)
const queryParams = ref({
    pageNum: 1,
    pageSize: 10,
    pointsName: null,
    pointsAddress: null,
    status: null,
})
const showSearch = ref(true)
const single = ref(true)
const multiple = ref(true)
const form = ref({})
const rules = {
        pointsName:[
          {required: true, message:"检测点名称不为空", trigger:"blur"}
        ],
        pointsAddress:[
          {required: true, message:"检测点地址不为空", trigger:"blur"}
        ],
        realTimePower:[
          {required: true, message:"实时功率不为空", trigger:"blur"}
        ],
        realTimeVolt:[
          {required: true, message:"实时电压不为空", trigger:"blur"}
        ],
        status:[
          {required: true, message:"状态不为空", trigger:"change"}
        ],
        reportTime:[
          {required: true, message:"上报时间不为空", trigger:"blur"}
        ],
      }
 const getList = async (paginationParams) => {
    loading.value = true;
    if (paginationParams) {
      queryParams.value.pageNum = paginationParams.page;
      queryParams.value.pageSize = paginationParams.limit;
    }
    const response = await listPrewarning(queryParams.value);
    prewarningList.value = response.rows;
    total.value = response.total;
    loading.value = false;
}
const cancel = async () => {
    open.value = false;
    reset()
}
const reset = async () => {
    console.log(formRef.value)
    form.value = {
        id:null,
        pointsName:null,
        pointsAddress:null,
        realTimePower:null,
        realTimeVolt:null,
        status:null,
        reportTime:null,
        mark:null
    }
    if(formRef.value){
        formRef.value.resetFields()
    }
}
const handleQuery = async () => {
    queryParams.value.pageNum=1;
    await getList()
}
const resetQuery = async () => {
    queryForm.value.resetFields();
    await getList()
}
const handleSelectionChange = async (selection) =>{
    ids.value=selection.map(item => item.id)
    single.value=selection.length !== 1
    multiple.value = !selection.length
}

const handleAdd = async () => {
    await reset()
    open.value = true
    title.value = "添加能效预警"
}
const handleUpdate = async (row) => {
    await reset()
    const id = row.id || ids.value[0]
    getPrewarning(id).then(res => {
        if(res && res.data){
            form.value = res.data
            open.value = true
            title.value="修改能效预警"
        }
        
    })
    console.log(id)
}
const submitForm = async () => {
    if(formRef.value){
        formRef.value.validate(valid => {
            if(valid){
            if(form.value.id != null){
                updatePrewarning(form.value).then(res => {
                    ElMessage.success("修改成功")
                    open.value = false
                    getList()
                })
            }else{
                addPrewarning(form.value).then(res => {
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
    console.log(1)
    const Ids = row.id || ids.value
    console.log(Ids.value)

    ElMessageBox.confirm('是否确认删除能效预警编号为"'+ Ids + '"的数据项？',{
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type:'warning'
    }).then(() => {
        return delPrewarning(Ids)
    }).then(() => {
        getList()
        ElMessage.success('删除成功')
    }).catch(() => {})
}
onMounted(() => getList())
</script>