
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css"

import SkillsTabs from "../Shared/SkillsTabs/SkillsTabs";



const Skills = () => {
    useEffect(() => {
        AOS.init();
    }, []);

    return (
        <SkillsTabs />

    );
};

export default Skills;