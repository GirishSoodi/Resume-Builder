import { useState } from 'react'
import { Briefcase, Loader2, Plus, Sparkles, Trash2 } from 'lucide-react'
import { useSelector } from 'react-redux'
import api from '../configs/api'
import toast from 'react-hot-toast'

const ExperienceForm = ({ data, onChange}) => {

    const {token} = useSelector(state => state.auth)
    const [generatingIndex, setGeneratingIndex] = useState(-1)

const addExperience = () => {
    const newExperience = {
        company: "",
        position: "",
        start_date: "",
        end_date: "",
        description: "",
        is_current: false
    };
    onChange([...data, newExperience])
}

const removeExperience = (index)=>{
    const updated = data.filter((_, i)=> i !== index);
    onChange(updated)
}

const updateExperience = (index, field, value)=>{
    const updated = [...data];
    updated[index] = {...updated[index], [field]: value}
    onChange(updated)
}

const generateDescription = async (index) => {
    setGeneratingIndex(index)

    try{
        const experience = data[index];
        const prompt = `Generate a professional job description ${experience.description} for a ${experience.position} at ${experience.company}. The description should highlight key responsibilities and achievements. Start the description with "Developed and maintained" and keep it concise.`

        const response = await api.post('/api/ai/enhance-job-desc', {userContent: prompt}, {headers: {Authorization: token}})
        updateExperience(index, "description", response.data.enhancedContent)

    }catch(error){
        console.error("Error generating description:", error)

    }finally{
        setGeneratingIndex(-1)
    }
}

  return (
    <div className='space-y-6'>
        <div className='flex items-center justify-between'>
            <div>
                <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>Professional Experience</h3>
                <p className='text-sm text-gray-500'>Add Your job experience</p>
            </div>
            <button onClick={addExperience} className='flex items-center gap-2 px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors'>
                <Plus className="size-4" />
                Add Experience
            </button>

        </div>

        {data.length === 0 ? (
            <div className='text-center py-8 text-gray-500'>
                <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-300"/>
                <p>No Work experience added yet</p>
                <p className="text-sm">Click "Add Experience" to get started.</p>

            </div>
        ): (
            <div className='space-y-4'>
                {data.map((experience, index)=>(
                    <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
                        <div className='flex justify-between items-start'>
                            <h4>Experience #{index + 1}</h4>
                            <button onClick={()=> removeExperience(index)} className='text-red-500 hover:text-red-700 transition-colors'>
                                <Trash2 className="size-4"/>
                            </button>

                        </div>
                        <div className='grid md:grid-cols-2 gap-3'>
                            <input value={experience.company || ""} onChange={(e)=>updateExperience(index, "company", e.target.value)} type="text" placeholder="Company Name" className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none"/>
                            <input value={experience.position || ""} onChange={(e)=>updateExperience(index, "position", e.target.value)} type="text" placeholder="Job Title" className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none"/>
                            <input value={experience.start_date || ""} onChange={(e)=>updateExperience(index, "start_date", e.target.value)} type="month" className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none"/>
                            <input value={experience.end_date || ""} onChange={(e)=>updateExperience(index, "end_date", e.target.value)} type="month" disabled={experience.is_current} className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100"/>

                        </div>
                        <label className='flex items-center gap-2'>
                            <input type="checkbox" checked={experience.is_current || false} onChange={(e)=>{updateExperience(index,"is_current", e.target.checked ? true : false);}} className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'/>
                            <span className='text-sm text-gray-700'>Currently Working here</span>

                        </label>

                        <div className="space-y-2">
                            <div className='flex items-center justify-between'>
                                <label className='text-sm font-medium text-gray-700' >Job Description</label>
                                <button onClick={()=> generateDescription(index)} disabled={generatingIndex === index || !experience.position || !experience.company} className='flex items-center gap-1 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50'>
                                    {generatingIndex === index ? ( <Loader2 className="w-3 h-3 animate-spin"/> ) : ( <Sparkles className='w-3 h-3'/> )}

                                    
                                    Enhance with AI
                                </button>
                            </div>
                            <textarea value={experience.description || ""} onChange={(e)=> updateExperience(index, "description", e.target.value)} rows={4} className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none resize-none" placeholder="Describe your key responsibilities and achievements.." />

                        </div>
                    </div>
                ))}

            </div>
        )}
      
    </div>
  )
}

export default ExperienceForm
