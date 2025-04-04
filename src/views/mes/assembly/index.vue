<template>
    <div class="app-container">
      <el-form :model="queryParams" ref="queryForm" :inline="true"  label-width="68px">
        <el-form-item label="作业名称" prop="jobName">
          <el-input
            v-model="queryParams.jobName"
            placeholder="请输入作业名称"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker
            v-model="daterangeStartTime"
            style="width: 240px"
            value-format="YYYY-MM-DD"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker
            v-model="daterangeEndTime"
            style="width: 240px"
            value-format="YYYY-MM-DD"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="作业状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="请选择作业状态" clearable style="width: 150px;">
            <el-option
              v-for="dict in mes_assembly_status"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery"><el-icon><Search/></el-icon>搜索</el-button>
          <el-button @click="resetQuery"><el-icon><Refresh/></el-icon>重置</el-button>
        </el-form-item>
      </el-form>
  
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            @click="handleAdd"
          ><el-icon><Plus/></el-icon>新增
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            plain
            :disabled="single"
            @click="handleUpdate"
          ><el-icon><Edit/></el-icon>修改
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            :disabled="multiple"
            @click="handleDelete"
          ><el-icon><Delete/></el-icon>删除
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            @click="handleExport"
          ><el-icon><Download/></el-icon>导出
          </el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>
  
      <el-table v-loading="loading" :data="assemblyList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column label="编号" align="center" prop="id"/>
        <el-table-column label="作业名称" align="center" prop="jobName"/>
        <el-table-column label="生产计划" align="center" prop="planNumber"/>
        <el-table-column label="计划排产" align="center" prop="serialNo"/>
        <el-table-column label="产品" align="center" prop="materialName"/>
        <el-table-column label="型号" align="center" prop="materialModel"/>
        <el-table-column label="规格" align="center" prop="materialSpecifications"/>
        <el-table-column label="单位" align="center" prop="materialUnit"/>
        <el-table-column label="开始时间" align="center" prop="startTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="结束时间" align="center" prop="endTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="生产数量" align="center" prop="quantity"/>
        <el-table-column label="作业状态" align="center" prop="status">
          <template #default="scope">
            <dict-tag :options="mes_assembly_status" :value="scope.row.status"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button
              type="text"
              icon="el-icon-receiving"
              v-if="scope.row.status == 0"
              @click="handleStatus(scope.row, 1)"
            >执行
            </el-button>
            <el-button
              type="text"
              icon="el-icon-receiving"
              v-if="scope.row.status == 1"
            >完成
            </el-button>
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
            >修改
            </el-button>
            <el-button
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
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
  
      <!-- 添加或修改作业装配对话框 -->
      <el-dialog :title="title" v-model="open" width="1000px" append-to-body>
        <el-form ref="formRef" :model="form" :rules="rules" label-width="80px" :inline="true">
          <el-row>
            <el-col :span="12">
              <el-form-item label="作业名称" prop="jobName">
                <el-input v-model="form.jobName" placeholder="请输入作业名称" :disabled="form.status > 0 ? true : false"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="生产计划" prop="serialNo">
                <el-input v-model="form.serialNo" placeholder="请选择计划排产" disabled>
                    <template #append>
                        <el-button  @click="selectPlan" :disabled="form.status > 0 ? true : false">选择</el-button>
                    </template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="产品" prop="materialName">
                <el-input v-model="form.materialName" disabled/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="型号" prop="materialModel">
                <el-input v-model="form.materialModel" disabled/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="规格" prop="materialSpecifications">
                <el-input v-model="form.materialSpecifications" disabled/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="单位" prop="materialUnit">
                <el-input v-model="form.materialUnit" disabled/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="待产数量" prop="producedQuantity">
                <el-input v-model="form.producedQuantity" disabled/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="已产数量" prop="quantityProduced">
                <el-input v-model="form.quantityProduced" disabled/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="开始时间" prop="startTime">
                <el-date-picker
                  clearable
                  v-model="form.startTime"
                  type="date"
                  value-format="YYYY-MM-DD"
                  disabled
                  placeholder="请选择开始时间">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="结束时间" prop="endDate">
                <el-date-picker
                  clearable
                  v-model="form.endTime"
                  type="date"
                  disabled
                  value-format="YYYY-MM-DD"
                  placeholder="请选择结束时间">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="生产数量" prop="quantity">
                <el-input v-model.number="form.quantity" placeholder="请输入生产数量" @input="quantityChange"
                          :disabled="form.status > 0 ? true : false"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="作业状态" prop="status">
                <el-select v-model="form.status" disabled style="width: 200px;">
                  <el-option
                    v-for="dict in mes_assembly_status"
                    :key="dict.value"
                    :label="dict.label"
                    :value="parseInt(dict.value)"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" placeholder="请输入备注" :disabled="form.status > 0 ? true : false"/>
          </el-form-item>
  
  
          <el-divider content-position="center">生产作业明细信息</el-divider>
          <el-table :data="mesJobAssemblyItemList" ref="mesMaterialApplyItem">
            <el-table-column label="序号" align="center" type="index" width="50"/>
            <el-table-column label="物料" prop="materialName" width="150">
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
            <el-table-column label="消耗数量" prop="usageQuantity" width="150">
              <template #default="scope">
                <el-form-item :prop="'mesJobAssemblyItemList.'+scope.$index+'.usageQuantity'"
                              :rules="rules.usageQuantity">
                  <el-input v-model="scope.row.usageQuantity" placeholder="" disabled/>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="备注" prop="remark" width="150">
              <template #default="scope">
                <el-input v-model="scope.row.remark" placeholder="请输入备注" :disabled="form.status > 0 ? true : false"/>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm" v-if="form.status == 0 || form.status == null">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </el-dialog>
      <!-- 计划排产弹框 start -->
      <ProductionDialog pickingStatus="1" v-model:open="productionOpen" @fun="handleChange" @close="close"/>
      <!-- 计划排产弹框 end -->
    </div>
  </template>
  
  <script setup>
  import {listAssembly,getAssembly,addAssembly,updateAssembly,uptAssemblyStatus,delAssembly} from '@/api/mes/assembly.js'
  import {getProduction} from '@/api/mes/production.js'
  import ProductionDialog from '@/views/components/ProductionDialog/index.vue'
  import {getBom} from '@/api/mes/bom'
  import { ElMessage,ElMessageBox } from 'element-plus'
  import {ref,onMounted,getCurrentInstance} from 'vue'
  import Pagination from '@/components/Pagination'
  const {proxy} = getCurrentInstance()
  const {
    mes_assembly_status
  } = proxy.useDict(
    "mes_assembly_status"
  )
  const loading = ref(true)
  const ids = ref([])
  const single = ref(true)
  const multiple = ref(true)
  const showSearch = ref(true)
  const total = ref(0)
  const assemblyList = ref([])
  const title = ref("")
  const open = ref(false)
  const mesJobAssemblyItemList = ref([])
  const daterangeStartTime = ref([])
  const daterangeEndTime = ref([])
  const form = ref({})
  const formRef = ref(null)
  const queryForm = ref(null)
  const mesMaterialApplyItemList = ref([])
  const queryParams = ref({
    pageNum:1,
    pageSize:10,
    jobName:null,
    startTime:null,
    endTime:null,
    status:null,

  })
  const rules = {
    jobName:[{
        required:true,message:"作业名称不为空",trigger:"blur"
    }],
    quantity:[{
        required:true,message:"生产数量不为空",trigger:"blur"
    }]
  }
  const productionOpen = ref(false)
  const planList = ref([])
  const isEdit = ref(false)

  const getList = async (paginationParams) => {
    loading.value = true
    queryParams.value.params = {}
    if(daterangeStartTime.value && daterangeStartTime.value === 2){
        queryParams.value.params.beginStartTime = daterangeStartTime.value[0]
        queryParams.value.params.endStartTime = daterangeStartTime.value[1]
    }
    if(daterangeEndTime.value && daterangeEndTime.value === 2){
        queryParams.value.params.beginEndTime = daterangeEndTime.value[0]
        queryParams.value.params.endEndTime = daterangeEndTime.value[1]
    }
    if(paginationParams){
        queryParams.value.pageNum = paginationParams.page
        queryParams.value.pageSize = paginationParams.limit
    }
    const res = await listAssembly(queryParams.value)
    assemblyList.value = res.rows
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
        jobName:null,
        plannedProductionId:null,
        quantity:null,
        bomId:null,
        startTime:null,
        endTime:null,
        status:null,
        remark:null
    }
    mesJobAssemblyItemList.value = []
    if(formRef.value){
        formRef.value.resetFields()
    }
  }
  const handleQuery = async () => {
    queryParams.value.pageNum=1
    await getList()
  }
  const resetQuery = async () => {
    daterangeStartTime.value = []
    daterangeEndTime.value = []
    queryForm.value.resetFields()
    handleQuery()
  }
  const handleSelectionChange = async (selection) => {
    ids.value = selection.map(item => item.id)
    single.value = selection.length !=1
    multiple.value = !selection.length
  }
  const handleAdd = async () => {
    reset()
    isEdit.value = false
    open.value = true
    title.value = "添加作业装配"
  }
  const handleUpdate = async(row) => {
    reset()
    isEdit.value = true
    const id = row.id || ids.value[0]
    getAssembly(id).then(res => {
        form.value = res.data
        mesJobAssemblyItemList.value = res.data.mesJobAssemblyItemList
        open.value = true
        title.value = "修改作业装配"
    })
  }
  const quantityChange = async (val) => {
    if(form.value.bomId && val){
        getBom(form.value.bomId).then(res => {
            let list = res.data.mesBomDetailItemList
            mesJobAssemblyItemList.value.forEach(jobItem => {
                let bom = list.find(item => item.materialId == jobItem.materialId)
                let usageQuantity = parseInt(bom.dosage) * parseInt(val)
                jobItem.usageQuantity = usageQuantity
            })
        })
    }
  }
  const handleStatus = async (row,status) => {
    uptAssemblyStatus({
        id:row.id,
        status:status
    }).then(res => {
        ElMessage.success("提交成功")
        getList()
    })
  }
  const submitForm =async () => {
    if(formRef.value){
        formRef.value.validate(valid => {
            if(valid){
                form.value.mesJobAssemblyItemList = mesJobAssemblyItemList.value
                if(form.value.id != null){
                    updateAssembly(form.value).then(res => {
                        ElMessage.success("修改成功")
                        open.value = false
                        getList()
                    })
                }else{
                    addAssembly(form.value).then(res => {
                        ElMessage.success("新增成功")
                        open.value = false
                        getList()
                    })
                }
            }
        })
    }
  }
  const handleChange =async (val) => {
    reset()
    getProduction(val.id).then(res => {
        form.value.plannedProductionId = res.data.id
        form.value.serialNo = res.data.serialNo
        form.value.bomId = res.data.bomId
        form.value.materialName = res.data.materialName
        form.value.materialModel = res.data.materialModel
        form.value.materialSpecifications = res.data.materialSpecifications
        form.value.materialUnit = res.data.materialUnit
        form.value.producedQuantity = res.data.producedQuantity
        form.value.quantityProduced = res.data.quantityProduced
        mesMaterialApplyItemList.value = []
        let list = res.data.mesPlannedProductionItemList
        list.forEach(res => {
            let obj = {}
            obj.materialId = res.materialId;
            obj.materialName = res.materialName;
            obj.materialModel = res.materialModel;
            obj.materialSpecifications = res.materialSpecifications;
            obj.materialUnit = res.materialUnit;
            obj.usageQuantity = ''
            obj.remark = ''
            mesJobAssemblyItemList.value.push(obj)
        })
    })
    productionOpen.value = false
}
const handleDelete = async (row) => {
    const Ids = row.id || ids.value
    ElMessageBox.confirm('是否确认删除作业装配编号为"'+ Ids + '"的数据项？',{
        confirmButtonText:'确认',
        cancelButtonText:'取消'
    }).then(() => {
        return delAssembly(Ids)
    }).then(() => {
        getList()
        ElMessage.success("删除成功")
    }).catch(() => {})
}
const selectPlan = async () => {
    productionOpen.value = true
}
const close = async () =>{
    productionOpen.value=false
}
  onMounted(() => getList())
</script>
  