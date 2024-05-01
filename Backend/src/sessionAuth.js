const activeSession = (req, res, next) => {
    if (req.session.name) {
        next();
    } else {
        res.redirect('/login');
    }
};

const activeUser = (req, res, next) => {
    if(req.session.type === "user"){
        next();
    }
    else{
        res.redirect('/dashboard');
    }
};

const activeAdmin = (req, res, next) => {
    if(req.session.type === "admin"){
        next();
    }
    else{
        res.redirect('/dashboard');
    }
};

const activeMedic = (req, res, next) => {
    if(req.session.type === "medic"){
        next();
    }
    else{
        res.redirect('/dashboard');
    }
};

module.exports = { activeSession, activeUser, activeAdmin, activeMedic };