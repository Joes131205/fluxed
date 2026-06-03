import { useState } from "react";
import { ScrollView } from "react-native";
import { AreaCreateForm } from "../../components/categories/AreaCreateForm";
import { SectionToggle } from "../../components/categories/SectionToggle";
import { SubareaCreateForm } from "../../components/categories/SubareaCreateForm";
import type { CategorySection } from "../../components/categories/categories.types";
import { PageHeader } from "../../components/ui/PageHeader";

export default function Categories() {
    const [section, setSection] = useState<CategorySection>("areas");

    return (
        <ScrollView
            className="flex-1 bg-background"
            contentContainerClassName="flex flex-col gap-6 py-8 px-4"
        >
            <PageHeader
                title="Category"
                description="Add your area or subarea of your life"
            />

            <SectionToggle section={section} onChange={setSection} />

            {section === "areas" ? <AreaCreateForm /> : <SubareaCreateForm />}
        </ScrollView>
    );
}
