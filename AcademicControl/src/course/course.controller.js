'use strict'

import Course from './course.model.js'
import Teacher from '../teacher/teacher.model.js'

import { checkUpdate } from '../utils/validator.js'

export const test = (req, res)=>{
    return res.send('Hello World')
}

export const addCourse = async(req, res)=>{
    try {
        //Capturamos info
        let data = req.body
        //Instancia del model
        let course = new Course(data)
        //Guardamos info
        await course.save()
        //Respuesta
        return res.send({message: 'Registered successfully'})
        
    } catch (err) {
        console.log(err)
        return res.status(500).send({message: 'Error registering user'})
    }
}

// Actualizar
export const updateCourse = async(req, res)=>{
    try {
        //Obtener id del curso
        let { id } = req.params
        //Obtenemos datos de actualización
        let data = req.body
        //Validamos si trae datos para actualizar
        let updateCourse = checkUpdate(data, id)
        if(!updateCourse) return res.status(400).send({message: 'Have submitted some data that cannot be updated or missing'})
        //Actualizamos
        let updatedCourse = await Course.findOneAndUpdate(
            {_id:id},
            data,
            {new:true}
        )

        //Validamos la actualización
        if(!updatedCourse) return res.status(404).send({message: 'Course not found'})
        //Respuesta
        return res.send({message: 'Course updated successfully', updatedCourse})

    } catch (err) {
         console.error(err)
         return res.status(500).send({message: 'Error updating course'})
    }

}


export const getTeacherCourses = async(req, res) =>{
    try {
      //Obtenemos el id del profe
      let {teacher} = req.body
    /*  // Obtenemos el ID del profesor
    const teacher = await Teacher.findById({ id });
    console.log(teacher)
    if (!teacher) {
      return res.status(404).send({ message: 'Teacher not found.' });
    } */


      //Retornar todos los cursos donde este el teacher
      let courses = await Course.find({teacher})
      //Retornamos los cursos
      return res.send(courses)

        
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error getting your courses.' })
    }
}

export const deleteCourse = async(req, res) =>{
    /*NOTA: 
    Siendo honesto. Hice el intento  deasignar a los 
    estudiantes del curso. Pero, mis modelos y relaciones no me lo permiten. Seguire intentando, una disculpa. */ 
    try {
     // Obtenemos el id del teacher
     let { id } = req.params
     // id del teacher en el curso
     let { teacher} = req.body

     // Obtenemos el teacher
     const teacherFound = await Teacher.findById(id);
     console.log(teacherFound)
     if (!teacherFound) {
       return res.status(404).send({ message: 'Teacher not found.' });
     } 
     //Obtenemos el curso por el id del teacher
     const course = await Course.findById(teacher)
     console.log(course)
     if (!course) {
       return res.status(404).send({ message: 'Course not found.' });
     }

     //Validamos de que el id del teacher en curso y el id de teacher en modelo sea el mismo
     if(id === teacher) return res.status(400).send({message: 'You are not the teacher of this course'})

     //Eliminamos el curso
     await Course.findByIdAndDelete({_id: teacher})
     //Respuesta
     return res.send({message: 'Course deleted successfully'})

    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error deleting course'})
    }
}