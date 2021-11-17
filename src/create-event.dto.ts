import { IsDateString, IsDefined, IsOptional, IsString, Length } from "class-validator"

export class CreateEventDto {
    @IsString()
    @Length(5, 255, {
        message: "OMG! What are you doing?!"
    })
    name: string

    @Length(5, 255)
    description: string

    @IsDateString()
    when: string

    @IsOptional()
    address: string
}