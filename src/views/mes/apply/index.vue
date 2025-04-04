<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px">
            <el-form-item label="领料单号" prop="oddNumber">
                <el-input
                v-model="queryParams.oddNumber"
                placeholder="请输入领料单号"
                clearable
                
                />
            </el-form-item>
            <el-form-item label="领取日期" prop="collectionDate">
                <el-date-picker
                v-model="queryParams.collectionDate"
                style="width: 240px;"
                value-format="YYYY-MM-DD"
                type="date"
                placeholder="请选择领取日期"
                ></el-date-picker>
            </el-form-item>
            <el-form-item label="申请人" prop="applicant">
                <el-select v-model="queryParams.applicant" placeholder="请选择申请人" clearable style="width: 240px;">
                    <el-option
                    v-for="dict in userList"
                    :key="dict.userId"
                    :label="dict.userName"
                    :value="dict.userId"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="申请时间" prop="applicantDate">
                <el-date-picker
                v-model="queryParams.applicantDate"
                style="width: 240px;"
                value-format="YYYY-MM-DD"
                type="date"
                placeholder="请选择申请时间"
                ></el-date-picker>
            </el-form-item>
            <el-form-item label="申请状态" prop="applicantStatus">
                <el-select v-model="queryParams.applicantStatus" placeholder="请选择申请状态" clearable style="width: 240px;">
                    <el-option
                    v-for="dict in mes_apply_status"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="审核人" prop="reviewer">
                <el-select v-model="queryParams.reviewer" placeholder="请选择申请人" clearable style="width: 240px;">
                    <el-option
                    v-for="dict in userList"
                    :key="dict.userId"
                    :label="dict.userName"
                    :value="dict.userId"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="审核时间" prop="reviewerDate">
                <el-date-picker
                v-model="queryParams.reviewerDate"
                style="width: 240px;"
                value-format="YYYY-MM-DD"
                type="date"
                placeholder="请选择审核时间"
                ></el-date-picker>
            </el-form-item>
            <el-form-item label="审核状态" prop="reviewerStatus">
                <el-select v-model="queryParams.reviewerStatus" placeholder="请选择审核状态" clearable style="width: 240px;">
                    <el-option
                    v-for="dict in mes_auditor_status"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery" style="width: 45px;">搜索</el-button>
                <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>
        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button
                type="primary"
                plain
                icon="el-icon-plus"
                size="small"
                @click="handleAdd"
                >新增</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button
                type="success"
                plain
                icon="el-icon-edit"
                size="small"
                @click="handleUpdate"
                :disabled="single"

                >修改</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button
                type="danger"
                plain
                icon="el-icon-delete"
                size="small"
                @click="handleDel"
                :disabled="multiple"

                >删除</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button
                type="warning"
                plain
                icon="el-icon-download"
                size="small"
                @click="handleExport"
                >导出</el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>


        <el-table v-loading="loading" :data="applyList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" :selectable="selectable"/>
            <el-table-column label="编号" align="center" prop="id" />
            <el-table-column label="领料单号" align="center" prop="oddNumber" />
            <el-table-column label="生产计划" align="center" prop="planNumber" />
            <el-table-column label="计划排产" align="center" prop="serialNo" />
            <el-table-column label="产品" align="center" prop="materialName" />
            <el-table-column label="型号" align="center" prop="materialSpecifications" />
            <el-table-column label="规格" align="center" prop="materialModel" />
            <el-table-column label="单位" align="center" prop="materialUnit" />
            <el-table-column label="领取日期" align="center" prop="collectionDate" width="180">
                <template #default="scope">
                    <span>{{ parseTime(scope.row.collectionDate , '{y}-{m}-{d}') }}</span>
                </template>
            </el-table-column>

            <el-table-column label="申请人" align="center" prop="applicantName" />
            <el-table-column label="申请时间" align="center" prop="applicantDate" width="180">
                <template #default="scope">
                    <span>{{ parseTime(scope.row.applicantDate , '{y}-{m}-{d}') }}</span>
                </template>
            </el-table-column>


            <el-table-column label="申请状态" align="center" prop="applicantStatus" >
                <template #default="scope">
                    <dict-tag :options="mes_apply_status" :value="scope.row.applicantStatus"></dict-tag>
                </template>
            </el-table-column>
            <el-table-column label="审核人" align="center" prop="reviewerName" />
            <el-table-column label="审核时间" align="center" prop="reviewerDate" width="180">
                <template #default="scope">
                    <span>{{ parseTime(scope.row.reviewerDate , '{y}-{m}-{d}') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="审核状态" align="center" prop="reviewerStatus" >
                <template #default="scope">
                    <dict-tag :options="mes_auditor_status" :value="scope.row.reviewerStatus"></dict-tag>
                </template>
            </el-table-column>
            <el-table-column label="状态" align="center" prop="status" >
                <template #default="scope">
                    <dict-tag :options="mes_material_status" :value="scope.row.status"></dict-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width" >
                <template #default="scope">
                    <el-button
                    size="small"
                    link
                    icon="el-icon-edit"
                    @click="handleUpdate(scope.row)"
                    >修改</el-button>
                    <el-button
                    size="small"
                    link
                    icon="el-icon-delete"
                    v-if="scope.row.applicantStatus != '1' && scope.row.reviewerStatus != '1'"
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
    
        <el-dialog v-model="open" :title="title" width="700px" append-to-body>
            <el-form ref="formRef" :model="form" :rules="rules" label-width="80px" :disabled="form.applicantStatus !=1 && form.reviewerStatus !=1?false:true">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="领料单号" prop="code">
                            <el-input v-model="form.oddNumber" disabled />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="计划排产" prop="serialNo">
                            <el-input v-model="form.serialNo" placeholder="请选择计划排产" disabled>
                                <template #append>
                                    <el-button @click="selectProduction">选择</el-button>
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
                        <el-form-item label="规格" prop="materialModel">
                            <el-input v-model="form.materialModel" disabled/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="型号" prop="materialSpecifications">
                            <el-input v-model="form.materialSpecifications" disabled/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="单位" prop="materialUnit">
                            <el-input v-model="form.materialUnit" disabled/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="待产数量" prop="producedQuantity">
                            <el-input v-model="form.producedQuantity" disabled/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="生产日期" prop="manufactureDate">
                            <el-date-picker 
                            v-model="form.manufactureDate" 
                            clearable
                            type="date"
                            value-format="YYYY-MM-DD"
                            disabled/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="领取日期" prop="collectionDate">
                            <el-date-picker 
                            v-model="form.collectionDate" 
                            clearable
                            type="date"
                            value-format="YYYY-MM-DD"
                            placeholder="请选择领取日期"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="备注" prop="remark">
                            <el-input v-model="form.remark" placeholder="请输入备注"/>
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
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="申请日期" prop="applicantDate">
                            <el-date-picker 
                            v-model="form.applicantDate" 
                            clearable
                            type="date"
                            value-format="YYYY-MM-DD"
                            disabled
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="申请状态" prop="applicantStatus">
                            <el-select v-model="form.applicantStatus" disabled>
                                <el-option
                                v-for="dict in mes_apply_status"
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
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="审核日期" prop="reviewerDate">
                            <el-date-picker 
                            v-model="form.reviewerDate" 
                            clearable
                            type="date"
                            value-format="YYYY-MM-DD"
                            disabled
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="申请状态" prop="reviewerStatus">
                            <el-select v-model="form.reviewerStatus" disabled>
                                <el-option
                                v-for="dict in mes_auditor_status"
                                :key="dict.value"
                                :label="dict.label"
                                :value="parseInt(dict.value)"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="审核意见" prop="revierComments">
                    <el-input v-model="form.revierComments" disabled></el-input>
                </el-form-item>
                <el-divider content-position="center">生产计划明细信息</el-divider>
                <el-table :data="mesMaterialApplyItemList" ref="mesMaterialApplyItem">
                    <el-table-column label="序号" align="center" type="index" width="50"/>
                    <el-table-column label="物料" prop="materialName" width=150>
                        <template #default="scope">
                            <el-input v-model="scope.row.materialName" disabled />
                        </template>
                    </el-table-column>
                    <el-table-column label="型号" prop="materialModel" width=150>
                        <template #default="scope">
                            <el-input v-model="scope.row.materialModel" disabled />
                        </template>
                    </el-table-column>
                    <el-table-column label="规格" prop="materialSpecifications" width=150>
                        <template #default="scope">
                            <el-input v-model="scope.row.materialSpecifications" disabled />
                        </template>
                    </el-table-column>
                    <el-table-column label="单位" prop="materialUnit" width=150>
                        <template #default="scope">
                            <el-input v-model="scope.row.materialUnit" disabled />
                        </template>
                    </el-table-column>
                    <el-table-column label="需求数量" prop="dosage" width=150>
                        <template #default="scope">
                            <el-input v-model="scope.row.dosage" disabled />
                        </template>
                    </el-table-column>
                    <el-table-column label="已领数量" prop="receivedQuantity" width=150>
                        <template #default="scope">
                            <el-input v-model="scope.row.receivedQuantity" disabled />
                        </template>
                    </el-table-column>
                    <el-table-column label="备注" prop="remark" width=150>
                        <template #default="scope">
                            <el-input v-model="scope.row.remark" placeholder="请输入备注" />
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button v-if="form.applicantStatus !=1 && form.reviewerStatus !=1" type="primary" @click="saveForm()">保存</el-button>
                <el-button v-if="form.applicantStatus !=1 && form.reviewerStatus !=1" type="primary" @click="submitForm()">提交</el-button>
                <el-button @click="cancel">取消</el-button>
            </div>
        </el-dialog>
        <ProductionDialog pickingStatus="0" v-model:open="productionOpen" @fun="handleChange" @close="close" />

    </div>
</template>

<script setup>
import {listApply,getApply,delApply,updateApply,addApply,submitApply}  from  '@/api/mes/apply.js'
import {listUser} from '@/api/system/user.js'
import {getProduction} from '@/api/mes/production.js'
import{ref,onMounted,getCurrentInstance} from 'vue'
import { ElMessage,ElMessageBox, formContextKey } from 'element-plus'
import Pagination from '@/components/Pagination'
import ProductionDialog from '@/views/components/ProductionDialog/index.vue'
const {proxy} = getCurrentInstance()
const {
    mes_apply_status,
    mes_auditor_status,
    mes_material_status,
} = proxy.useDict(
    "mes_apply_status",
    "mes_auditor_status",
    "mes_material_status",
)
const loading= ref(true)
const ids = ref([])
const single= ref(true)
const multiple = ref(true)
const showSearch = ref(true)
const total = ref(0)
const applyList = ref([])
const title = ref("")
const open = ref(false)
const checkedMesMaterialApplyItem = ref([])
const queryParams = ref({
    pageNum:1,
    pageSize:10,
    oddNumber:null,
    collectionDate:null,
    applicant:null,
    applicantDate:null,
    applicantStatus:null,
    reviewer:null,
    reviewerDate:null,
    reviewerStatus:null,

})
const form = ref({})
const formRef = ref(null)
const queryForm = ref(null)
const userList = ref([])
const mesMaterialApplyItemList = ref([])
const productionList = ref([])
const productionOpen = ref(false)
const rules = {
    serialNo:[
        {required:true,message:"计划排产不为空",trigger:"blur"}
    ],
    collectionDate:[
        {required:true,message:"领取日期不为空",trigger:"blur"}
    ],
}

const getList = async (paginationParams)  =>{
    loading.value = true
    if(paginationParams){
        queryParams.value.pageNum = paginationParams.page
        queryParams.value.pageSize = paginationParams.limit

    }
    const userRes = await listUser()
    const res = await listApply(queryParams.value)
    userList.value = userRes.rows
    applyList.value = res.rows
    total.value= res.total
    loading.value = false
}
const handleSelectionChange = async (selection) => {
    ids.value = selection.map(item => item.id)
    single.value = selection.length !== 1
    multiple.value = !selection.length
}
const selectable = async (row,index) => {
    if(row.applicantStatus == 1 || row.reviewerStatus ==1){
        return false
    }else{
        return true
    }
}
const handleQuery = async () => {
    queryParams.value.pageNum = 1;
    await getList()
}
const resetQuery = async () => {
    queryForm.value.resetFields()
    await getList()
}
const reset = async () => {
    form.value = {
        id:null,
        oddNumber:null,
        plannedProductionId:null,
        serialNo:null,
        collectionData:null,
        remark:null
    }
    mesMaterialApplyItemList.value = []
    if(formRef.value){
        formRef.value.resetFields()
    }
}

const handleAdd = async () => {
    await reset()
    open.value = true
    title.value = "添加领料申请"
}
const handleUpdate = async (row) => {
    await reset()
    const id = row.id || ids.value[0]
    getApply(id).then(res => {
        if(res && res.data){
            form.value = res.data
            mesMaterialApplyItemList.value = res.data.mesMaterialApplyItemList
            open.value = true
            title.value = "修改领料申请"
        }
    })
}
const selectProduction = async () => {
    productionOpen.value = true
    console.log(productionOpen.value)
}

const saveForm = async (status) =>{
    if(formRef.value){
        formRef.value.validate(valid => {
            if(valid){
                form.value.mesMaterialApplyItemList = mesMaterialApplyItemList.value
                if(form.value.id != null){
                    updateApply(form.value).then(res => {
                        ElMessage.success("修改成功")
                        open.value = false
                        getList()
                    })
                }else{
                    addApply(form.value).then(res => {
                        ElMessage.success("新增成功")
                        open.value = false
                        getList()
                    })
                }
            }
        })
    }
}
const cancel =async () => {
    open.value= false
    reset()
}
const submitForm = async () => {
    if(formRef.value){
        formRef.value.validate(valid => {
            if(valid){
                form.value.mesMaterialApplyItemList = mesMaterialApplyItemList.value
                submitApply(form.value).then(res => {
                    ElMessage.success("提交成功")
                    open.value = false
                    getList()
                })
            }
        })
    }
}
const handleDel = async (row) => {
    const Ids = row.id || ids.value
    ElMessageBox.confirm('是否确认删除领料申请编号为"'+ Ids + '"的数据',{
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type:'warning'
    }).then(() => {
        return delApply(Ids)
    }).then(() => {
        getList()
        ElMessage.success("删除成功")
    }).catch(() => {})
}

const handleChange =async (val) => {
    getProduction(val.id).then(res => {
        form.value.plannedProductionId = res.data.id
        form.value.serialNo = res.data.serialNo
        form.value.materialName = res.data.materialName
        form.value.materialModel = res.data.materialModel
        form.value.materialSpecifications = res.data.materialSpecifications
        form.value.materialUnit = res.data.materialUnit
        form.value.manufactureDate = res.data.manufactureDate
        form.value.producedQuantity = res.data.producedQuantity
        let list = res.data.mesPlannedProductionItemList
        list.forEach(material => {
            let obj = {}
            obj.materialId = material.materialId;
            obj.materialName = material.materialName;
            obj.materialModel = material.materialModel;
            obj.materialSpecifications = material.materialSpecifications;
            obj.materialUnit = material.materialUnit;
            obj.dosage = material.dosage;
            obj.receivedQuantity = ''
            mesMaterialApplyItemList.value.push(obj)
        })
    })
    productionOpen.value = false
}
const close = async () =>{
    productionOpen.value=false
}

onMounted(() => 
    getList(),
    

)

</script>