const express = require('express')
const router = express.Router()
const Contact = require('../models/Contact')

router.post('/contact',async(req,res)=>{
   const {name,email,message} = req.body

   const contactData = {
    name,email,message
   }

  const data = await Contact.create(contactData)
  if(data)
  res.status(200).json({data})
 else res.status(500).json("Something wrong")
} )

module.exports = router