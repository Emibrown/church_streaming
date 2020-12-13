 const checkLevelOneAccess = (req, res, next) => {
    if(req.user.level !=1 && req.user.level !=0){
      res.redirect('/admin/dashboard');
    }else{
      next();
    }
  }
  
  const checkLevelTwoAcess = (req, res, next) =>{
      if(req.user.level == 1 || req.user.level == 2 || req.user.level ==0){
        next();
    }else{
      res.redirect('/admin/dashboard');
    }
  }
  
  const checkLevelThreeAcess = (req, res, next) =>{
    if(req.user.level == 1 || req.user.level == 2 || req.user.level==3 || req.user.level ==0){
      next();
  }else{
    res.redirect('/admin/dashboard');
  }
}

const restrictions = {
    checkLevelOneAccess,
    checkLevelTwoAcess,
    checkLevelThreeAcess
}

module.exports = restrictions;